import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";

const INQUIRY_EMAIL_TO = "returntorootsafrica@gmail.com";
const RESEND_FROM = process.env.RESEND_FROM ?? "Return to Roots <onboarding@resend.dev>";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, preferredDates, duration, interests, message } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.from("journey_inquiries").insert({
      name,
      email,
      phone: phone || null,
      preferred_dates: preferredDates || null,
      duration: duration || null,
      interests: interests || null,
      message: message || null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit inquiry" },
        { status: 500 }
      );
    }

    // Send email to returntorootsafrica@gmail.com
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const phoneVal = phone || "—";
      const datesVal = preferredDates || "—";
      const durationVal = duration || "—";
      const interestsVal = interests?.trim() || "—";
      const messageVal = message?.trim() || "—";

      const emailBodyText = [
        "New Journey Inquiry from Return to Roots Website",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phoneVal}`,
        `Preferred Dates: ${datesVal}`,
        `Duration: ${durationVal}`,
        "",
        `Interests: ${interestsVal}`,
        "",
        `Message: ${messageVal}`,
        "",
        "— Submitted from the Return to Roots website.",
      ].join("\n");

      const emailBodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; line-height: 1.5; color: #1a1a1a; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%); padding: 24px 28px;">
              <h1 style="margin:0; font-size: 20px; font-weight: 600; color: #ffffff; letter-spacing: -0.02em;">Return to Roots</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.85);">New Journey Inquiry</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.04em;">Contact</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong style="display: inline-block; width: 120px; color: #555;">Name</strong> ${escapeHtml(name)}</td></tr>
                <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong style="display: inline-block; width: 120px; color: #555;">Email</strong> <a href="mailto:${escapeHtml(email)}" style="color: #1a472a; text-decoration: none;">${escapeHtml(email)}</a></td></tr>
                <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong style="display: inline-block; width: 120px; color: #555;">Phone</strong> ${escapeHtml(phoneVal)}</td></tr>
              </table>
              <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.04em;">Journey details</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong style="display: inline-block; width: 120px; color: #555;">Preferred dates</strong> ${escapeHtml(datesVal)}</td></tr>
                <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong style="display: inline-block; width: 120px; color: #555;">Duration</strong> ${escapeHtml(durationVal)}</td></tr>
              </table>
              <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.04em;">Interests</h2>
              <p style="margin: 0 0 20px 0; padding: 10px 12px; background: #f8f9fa; border-radius: 6px; color: #333;">${escapeHtml(interestsVal)}</p>
              <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.04em;">Message</h2>
              <p style="margin: 0; padding: 12px; background: #f8f9fa; border-radius: 6px; color: #333; white-space: pre-wrap;">${escapeHtml(messageVal)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 28px; background: #f8f9fa; border-top: 1px solid #eee; font-size: 12px; color: #888;">
              Submitted from the Return to Roots website.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim();

      const { error: emailError } = await resend.emails.send({
        from: RESEND_FROM,
        to: INQUIRY_EMAIL_TO,
        subject: `New Journey Inquiry from ${name}`,
        text: emailBodyText,
        html: emailBodyHtml,
      });

      if (emailError) {
        console.error("Resend email error:", emailError);
        // Inquiry is already saved; don't fail the request
      }
    } else {
      console.warn("RESEND_API_KEY not set; inquiry saved to DB but no email sent.");
    }

    return NextResponse.json(
      { message: "Inquiry submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
