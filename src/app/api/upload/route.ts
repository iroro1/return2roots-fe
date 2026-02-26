import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

export const runtime = "nodejs";

const UPLOAD_DIR = "public/uploads";
const MAX_SIZE = 4 * 1024 * 1024; // 4MB target per image
const MAX_DIMENSION = 1920; // max width or height
const DEFAULT_QUALITY = 85;
const MIN_QUALITY = 50;

const MAX_FILES = 5;

function getFiles(formData: FormData): File[] {
  const files: File[] = [];
  const fromGetAll = formData.getAll("file");
  for (const entry of fromGetAll) {
    if (entry instanceof File && entry.size > 0) files.push(entry);
  }
  if (files.length > 0) return files;
  const single = formData.get("file") ?? formData.get("image");
  if (single instanceof File && single.size > 0) return [single];
  for (const [, value] of formData.entries()) {
    if (value instanceof File && value.size > 0) files.push(value);
    if (files.length >= MAX_FILES) break;
  }
  return files.slice(0, MAX_FILES);
}

function isImageType(type: string): boolean {
  return type.startsWith("image/");
}

/** Compress and resize image to meet size limit. Returns JPEG buffer or null if not processable. */
async function compressImage(input: Buffer, maxBytes: number): Promise<Buffer | null> {
  try {
    let quality = DEFAULT_QUALITY;
    let buffer: Buffer;

    const pipeline = sharp(input)
      .rotate() // auto-orient from EXIF
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true });

    buffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();

    while (buffer.length > maxBytes && quality > MIN_QUALITY) {
      quality -= 10;
      buffer = await sharp(input)
        .rotate()
        .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: Math.max(quality, MIN_QUALITY), mozjpeg: true })
        .toBuffer();
    }

    return buffer;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to upload." }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const files = getFiles(formData);
    if (files.length === 0) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} images per upload.` }, { status: 400 });
    }
    const safeId = session.user.id.replace(/[^a-z0-9-]/gi, "_");
    const dir = path.join(process.cwd(), UPLOAD_DIR);
    await mkdir(dir, { recursive: true });
    const urls: string[] = [];

    const extFromType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/heic": "heic",
      "image/heif": "heif",
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      if (!isImageType(file.type)) {
        return NextResponse.json({ error: "All files must be images (e.g. JPEG, PNG, WebP, HEIC)." }, { status: 400 });
      }
      const bytes = await file.arrayBuffer();
      const input = Buffer.from(bytes);
      const compressed = await compressImage(input, MAX_SIZE);

      if (compressed && compressed.length > 0) {
        const filename = `${safeId}-${Date.now()}-${i}.jpg`;
        const filepath = path.join(dir, filename);
        await writeFile(filepath, compressed);
        urls.push(`/uploads/${filename}`);
      } else {
        // Sharp couldn't process (e.g. HEIC): save original only if under size
        if (input.length <= MAX_SIZE && extFromType[file.type]) {
          const ext = extFromType[file.type];
          const filename = `${safeId}-${Date.now()}-${i}.${ext}`;
          const filepath = path.join(dir, filename);
          await writeFile(filepath, input);
          urls.push(`/uploads/${filename}`);
        } else {
          return NextResponse.json({
            error: `Could not process "${file.name}". Try JPEG, PNG or WebP under 4MB.`,
          }, { status: 400 });
        }
      }
    }

    return NextResponse.json(urls.length === 1 ? { url: urls[0] } : { urls });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    console.error("Upload error:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
