import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@/lib/supabase/server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check whether this email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from("subscribers")
      .select("id, is_active")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (checkError) {
      console.error("Subscriber lookup error:", checkError);

      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    // Already subscribed
    if (existingSubscriber?.is_active) {
      return NextResponse.json(
        { message: "You're already subscribed to Techie Hub." },
        { status: 200 }
      );
    }

    // Insert new subscriber
    if (!existingSubscriber) {
      const { error: insertError } = await supabase
        .from("subscribers")
        .insert({
          email: normalizedEmail,
          is_active: true,
        });

      if (insertError) {
        console.error("Subscriber insert error:", insertError);

        return NextResponse.json(
          { error: "Unable to subscribe right now. Please try again." },
          { status: 500 }
        );
      }
    } else {
      // Reactivate an existing inactive subscriber
      const { error: updateError } = await supabase
        .from("subscribers")
        .update({ is_active: true })
        .eq("id", existingSubscriber.id);

      if (updateError) {
        console.error("Subscriber update error:", updateError);

        return NextResponse.json(
          { error: "Unable to subscribe right now. Please try again." },
          { status: 500 }
        );
      }
    }

    // Send confirmation email through Gmail
    try {
      await transporter.sendMail({
        from: `Techie Hub <${process.env.GMAIL_USER}>`,
        to: normalizedEmail,
        subject: "You're subscribed to Techie Hub!",
        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #111827;
              max-width: 600px;
              margin: 0 auto;
              padding: 32px 24px;
            "
          >

            <!-- Logo -->
            <div style="margin-bottom: 28px;">
              <a
                href="https://techiehub-ten.vercel.app"
                target="_blank"
                style="text-decoration: none;"
              >
                <img
                  src="https://techiehub-ten.vercel.app/logo-horizontal.png"
                  alt="Techie Hub"
                  width="180"
                  style="
                    display: block;
                    width: 180px;
                    height: auto;
                    border: 0;
                  "
                />
              </a>
            </div>

            <!-- Content -->
            <h2
              style="
                margin: 0 0 12px;
                font-size: 24px;
                line-height: 1.3;
                color: #111827;
              "
            >
              You're subscribed to Techie Hub!
            </h2>

            <p>
              Thanks for subscribing to Techie Hub.
            </p>

            <p>
              We'll notify you whenever a new tech event is published on
              Techie Hub.
            </p>

            <p>
              Stay connected, discover new opportunities, and never miss an
              event happening in Karachi's tech community.
            </p>

            <p style="margin-top: 28px;">
              — Techie Hub
            </p>

            <!-- Footer -->
            <div
              style="
                margin-top: 40px;
                padding-top: 24px;
                border-top: 1px solid #e5e7eb;
              "
            >

              <!-- Social Icons -->
              <div
                style="
                  text-align: center;
                  margin-bottom: 18px;
                "
              >

                <!-- Website -->
                <a
                  href="https://techiehub-pk.vercel.app"
                  target="_blank"
                  style="
                    display: inline-block;
                    margin: 0 7px;
                    text-decoration: none;
                  "
                >
                  <img
                    src="https://techiehub-pk.vercel.app/icons/website.png"
                    alt="Website"
                    width="20"
                    height="20"
                    style="
                      display: block;
                      width: 20px;
                      height: 20px;
                      border: 0;
                    "
                  />
                </a>

                <!-- LinkedIn -->
                <a
                  href="https://www.linkedin.com/company/techiehub-pk"
                  target="_blank"
                  style="
                    display: inline-block;
                    margin: 0 7px;
                    text-decoration: none;
                  "
                >
                  <img
                    src="https://techiehub-pk.vercel.app/icons/linkedin.png"
                    alt="LinkedIn"
                    width="20"
                    height="20"
                    style="
                      display: block;
                      width: 20px;
                      height: 20px;
                      border: 0;
                    "
                  />
                </a>

                <!-- X -->
                <a
                  href="https://x.com/techiehub_pk"
                  target="_blank"
                  style="
                    display: inline-block;
                    margin: 0 7px;
                    text-decoration: none;
                  "
                >
                  <img
                    src="https://techiehub-pk.vercel.app/icons/x.png"
                    alt="X"
                    width="20"
                    height="20"
                    style="
                      display: block;
                      width: 20px;
                      height: 20px;
                      border: 0;
                    "
                  />
                </a>

                <!-- Instagram -->
                <a
                  href="https://www.instagram.com/techiehub_pk"
                  target="_blank"
                  style="
                    display: inline-block;
                    margin: 0 7px;
                    text-decoration: none;
                  "
                >
                  <img
                    src="https://techiehub-pk.vercel.app/icons/instagram.png"
                    alt="Instagram"
                    width="20"
                    height="20"
                    style="
                      display: block;
                      width: 20px;
                      height: 20px;
                      border: 0;
                    "
                  />
                </a>

                <!-- Discord -->
                <a
                  href="https://discord.gg/45DGGCDfxb"
                  target="_blank"
                  style="
                    display: inline-block;
                    margin: 0 7px;
                    text-decoration: none;
                  "
                >
                  <img
                    src="https://techiehub-pk.vercel.app/icons/discord.png"
                    alt="Discord"
                    width="20"
                    height="20"
                    style="
                      display: block;
                      width: 20px;
                      height: 20px;
                      border: 0;
                    "
                  />
                </a>

              </div>

              <!-- Footer text -->
              <p
                style="
                  margin: 0;
                  text-align: center;
                  font-size: 12px;
                  color: #9ca3af;
                "
              >
                Techie Hub — Discover what's happening in Karachi's tech
                community.
              </p>

              <p
                style="
                  margin: 8px 0 0;
                  text-align: center;
                  font-size: 12px;
                  color: #9ca3af;
                "
              >
                © ${new Date().getFullYear()} Techie Hub. All rights reserved.
              </p>

            </div>

          </div>
        `,
      });
    } catch (emailError) {
      console.error("Gmail error:", emailError);

      // Subscription succeeded even if email failed.
      return NextResponse.json(
        {
          message:
            "You're subscribed, but we couldn't send the confirmation email.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "✅ You're subscribed! You'll be notified about new events.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}