import "server-only";

import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const SITE_URL = process.env.SITE_URL!;

const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/techiehub-pk",
  instagram: "https://www.instagram.com/techiehub_pk",
  x: "https://x.com/techiehub_pk",
  discord: "https://discord.gg/45DGGCDfxb",
};

type EventData = {
  id: string;
  title: string;
  category: string;
  event_date: string;
  location: string;
  organizer: string;
  image_url?: string | null;
};

function escapeHtml(value: string | null | undefined) {
  if (!value) return "";

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCategory(category: string) {
  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("en-PK", {
    timeZone: "Asia/Karachi",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(date));
}

export async function notifySubscribers(event: EventData) {
  // ---------------------------------------------------------
  // Get active subscribers
  // ---------------------------------------------------------

  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select("email")
    .eq("is_active", true);

  if (error) {
    console.error("Subscriber lookup error:", error);
    throw error;
  }

  if (!subscribers || subscribers.length === 0) {
    return {
      sent: 0,
      failed: 0,
    };
  }

  // ---------------------------------------------------------
  // Format event information
  // ---------------------------------------------------------

  const formattedDate = formatEventDate(event.event_date);
  const formattedCategory = formatCategory(event.category);

  const eventUrl = `${SITE_URL}/events/${event.id}`;

  // ---------------------------------------------------------
  // Plain-text email
  // ---------------------------------------------------------

  const text = `
A new tech event has been added to Techie Hub.

${event.title}

Category: ${formattedCategory}
Date: ${formattedDate}
Location: ${event.location}
Organizer: ${event.organizer}

View Event:
${eventUrl}

Techie Hub
Never miss a tech event in Karachi.

Follow Techie Hub:

Website: ${SITE_URL}
LinkedIn: ${SOCIAL_LINKS.linkedin}
Instagram: ${SOCIAL_LINKS.instagram}
X: ${SOCIAL_LINKS.x}
Discord: ${SOCIAL_LINKS.discord}
`;

  // ---------------------------------------------------------
  // HTML email
  // ---------------------------------------------------------

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>New Event - Techie Hub</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f7f7f7;
    font-family: Arial, Helvetica, sans-serif;
    color: #111111;
  "
>

  <div style="padding: 40px 16px;">

    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        overflow: hidden;
      "
    >

      <!-- Header -->

      <div
        style="
          padding: 28px 32px;
          border-bottom: 1px solid #eeeeee;
        "
      >

        <a
          href="${escapeHtml(SITE_URL)}"
          target="_blank"
          style="
            display: inline-block;
            text-decoration: none;
          "
        >
          <img
            src="${escapeHtml(SITE_URL)}/logo-horizontal.png"
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

        <div
          style="
            margin-top: 8px;
            font-size: 14px;
            color: #6b7280;
          "
        >
          Never miss a tech event in Karachi.
        </div>

      </div>


      <!-- Content -->

      <div style="padding: 32px;">

        <!-- Category -->

        <div
          style="
            display: inline-block;
            padding: 6px 12px;
            background-color: #f3f4f6;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 16px;
          "
        >
          ${escapeHtml(formattedCategory)}
        </div>


        <!-- Title -->

        <h1
          style="
            margin: 0 0 24px 0;
            font-size: 28px;
            line-height: 1.3;
            color: #111111;
          "
        >
          ${escapeHtml(event.title)}
        </h1>


        <!-- Event Image -->

        ${event.image_url
      ? `
              <img
                src="${escapeHtml(event.image_url)}"
                alt="${escapeHtml(event.title)}"
                width="536"
                style="
                  display: block;
                  width: 100%;
                  max-width: 536px;
                  height: auto;
                  max-height: 280px;
                  object-fit: cover;
                  border-radius: 12px;
                  margin-bottom: 24px;
                  border: 0;
                "
              />
            `
      : ""
    }


        <!-- Event Details -->

        <div
          style="
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 28px;
          "
        >

          <!-- Date -->

          <div style="margin-bottom: 16px;">

            <div
              style="
                font-size: 11px;
                font-weight: 700;
                color: #9ca3af;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              "
            >
              Date
            </div>

            <div
              style="
                margin-top: 5px;
                font-size: 15px;
                color: #111827;
              "
            >
              ${escapeHtml(formattedDate)}
            </div>

          </div>


          <!-- Location -->

          <div style="margin-bottom: 16px;">

            <div
              style="
                font-size: 11px;
                font-weight: 700;
                color: #9ca3af;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              "
            >
              Location
            </div>

            <div
              style="
                margin-top: 5px;
                font-size: 15px;
                color: #111827;
              "
            >
              ${escapeHtml(event.location)}
            </div>

          </div>


          <!-- Organizer -->

          <div>

            <div
              style="
                font-size: 11px;
                font-weight: 700;
                color: #9ca3af;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              "
            >
              Organizer
            </div>

            <div
              style="
                margin-top: 5px;
                font-size: 15px;
                color: #111827;
              "
            >
              ${escapeHtml(event.organizer)}
            </div>

          </div>

        </div>


        <!-- View Event Button -->

<div style="text-align: center; margin-bottom: 28px;">

  <a
    href="${escapeHtml(eventUrl)}"
    target="_blank"
    style="
      display: inline-block;
      padding: 12px 24px;
      background-color: #111111;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
    "
  >
    View Event
  </a>

</div>
      </div>


      <!-- Footer -->

      <div
        style="
          padding: 28px 32px;
          background-color: #fafafa;
          border-top: 1px solid #eeeeee;
          text-align: center;
        "
      >

        <div
          style="
            margin-bottom: 16px;
            font-size: 13px;
            color: #6b7280;
          "
        >
          Follow Techie Hub
        </div>


        <!-- Social Icons -->

        <table
          role="presentation"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="margin: 0 auto 20px auto;"
        >
          <tr>

            <!-- Website -->

            <td style="padding: 0 6px;">
              <a
                href="${escapeHtml(SITE_URL)}"
                target="_blank"
                style="
                  display: inline-block;
                  text-decoration: none;
                "
              >
                <img
                  src="${escapeHtml(SITE_URL)}/icons/website.png"
                  alt="Website"
                  width="24"
                  height="24"
                  style="
                    display: block;
                    width: 24px;
                    height: 24px;
                    border: 0;
                  "
                />
              </a>
            </td>


            <!-- LinkedIn -->

            <td style="padding: 0 6px;">
              <a
                href="${escapeHtml(SOCIAL_LINKS.linkedin)}"
                target="_blank"
                style="
                  display: inline-block;
                  text-decoration: none;
                "
              >
                <img
                  src="${escapeHtml(SITE_URL)}/icons/linkedin.png"
                  alt="LinkedIn"
                  width="24"
                  height="24"
                  style="
                    display: block;
                    width: 24px;
                    height: 24px;
                    border: 0;
                  "
                />
              </a>
            </td>


            <!-- X -->

            <td style="padding: 0 6px;">
              <a
                href="${escapeHtml(SOCIAL_LINKS.x)}"
                target="_blank"
                style="
                  display: inline-block;
                  text-decoration: none;
                "
              >
                <img
                  src="${escapeHtml(SITE_URL)}/icons/x.png"
                  alt="X"
                  width="24"
                  height="24"
                  style="
                    display: block;
                    width: 24px;
                    height: 24px;
                    border: 0;
                  "
                />
              </a>
            </td>


            <!-- Instagram -->

            <td style="padding: 0 6px;">
              <a
                href="${escapeHtml(SOCIAL_LINKS.instagram)}"
                target="_blank"
                style="
                  display: inline-block;
                  text-decoration: none;
                "
              >
                <img
                  src="${escapeHtml(SITE_URL)}/icons/instagram.png"
                  alt="Instagram"
                  width="24"
                  height="24"
                  style="
                    display: block;
                    width: 24px;
                    height: 24px;
                    border: 0;
                  "
                />
              </a>
            </td>


            <!-- Discord -->

            <td style="padding: 0 6px;">
              <a
                href="${escapeHtml(SOCIAL_LINKS.discord)}"
                target="_blank"
                style="
                  display: inline-block;
                  text-decoration: none;
                "
              >
                <img
                  src="${escapeHtml(SITE_URL)}/icons/discord.png"
                  alt="Discord"
                  width="24"
                  height="24"
                  style="
                    display: block;
                    width: 24px;
                    height: 24px;
                    border: 0;
                  "
                />
              </a>
            </td>

          </tr>
        </table>


        <div
          style="
            font-size: 12px;
            line-height: 1.5;
            color: #9ca3af;
          "
        >
          You are receiving this email because you subscribed
          to Techie Hub event updates.
        </div>

        <div
          style="
            margin-top: 8px;
            font-size: 12px;
            color: #9ca3af;
          "
        >
          © ${new Date().getFullYear()} Techie Hub. All rights reserved.
        </div>

      </div>

    </div>

  </div>

</body>
</html>
`;

  // ---------------------------------------------------------
  // Send emails
  // ---------------------------------------------------------

  const emailPromises = subscribers.map((subscriber) =>
    transporter.sendMail({
      from: `"Techie Hub" <${process.env.GMAIL_USER}>`,
      to: subscriber.email,
      subject: `New Tech Event: ${event.title}`,
      text,
      html,
    })
  );

  const results = await Promise.allSettled(emailPromises);

  const sent = results.filter(
    (result) => result.status === "fulfilled"
  ).length;

  const failed = results.filter(
    (result) => result.status === "rejected"
  ).length;

  if (failed > 0) {
    console.error(
      "Some subscriber emails failed:",
      results.filter((result) => result.status === "rejected")
    );
  }

  return {
    sent,
    failed,
  };
}