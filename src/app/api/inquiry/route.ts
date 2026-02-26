import { NextRequest, NextResponse } from "next/server";

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

    // Create email content
    const emailSubject = `New Journey Inquiry from ${name}`;
    const emailBody = `
New Journey Inquiry from Return to Roots Website

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}

Preferred Dates: ${preferredDates || "Not specified"}
Duration: ${duration || "Not specified"}

Interests:
${interests || "Not specified"}

Message:
${message || "No additional message"}

---
This inquiry was submitted from the Return to Roots website.
    `.trim();

    // For now, return success (you can integrate with an email service like Resend, SendGrid, etc.)
    // Example with Resend would be:
    // await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: 'hello@returntoroots.com',
    //   subject: emailSubject,
    //   text: emailBody,
    // });

    // For development, log the email content
    console.log("Email would be sent to: hello@returntoroots.com");
    console.log("Subject:", emailSubject);
    console.log("Body:", emailBody);

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
