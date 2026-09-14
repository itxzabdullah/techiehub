import "server-only";

export type EventOperation = "INSERT" | "UPDATE";

export type ChangedField =
  | "title"
  | "event_date"
  | "location"
  | "registration_link";

export type EventData = {
  id: string;
  title: string;
  category: string;
  event_date: string;
  location: string;
  organizer: string;
  image_url?: string | null;
};

export const CHANGE_LABELS: Record<ChangedField, string> = {
  title: "Event title",
  event_date: "Date and time",
  location: "Location",
  registration_link: "Registration information",
};

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/techiehub-pk",
  instagram: "https://www.instagram.com/techiehub_pk",
  x: "https://x.com/techiehub_pk",
  discord: "https://discord.gg/45DGGCDfxb",
};

export function escapeHtml(value: string | null | undefined) {
  if (!value) return "";

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatCategory(category: string) {
  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("en-PK", {
    timeZone: "Asia/Karachi",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(date));
}

function renderEventDetails(event: EventData) {
  const formattedDate = formatEventDate(event.event_date);
  const formattedCategory = formatCategory(event.category);

  return {
    formattedDate,
    formattedCategory,
    eventUrl: `${process.env.SITE_URL}/events/${event.id}`,
  };
}

/**
 * Creates the plain-text version of a single event notification.
 */
export function renderEventNotificationText(
  event: EventData,
  operation: EventOperation,
  changedFields: ChangedField[] = []
) {
  const { formattedDate, formattedCategory, eventUrl } =
    renderEventDetails(event);

  const isUpdate = operation === "UPDATE";

  const emailHeading = isUpdate
    ? "An event on Techie Hub has been updated."
    : "A new tech event has been added to Techie Hub.";

  const changedFieldsText =
    isUpdate && changedFields.length > 0
      ? `What changed:
${changedFields
  .map((field) => `• ${CHANGE_LABELS[field]}`)
  .join("\n")}

`
      : "";

  return `${emailHeading}

${event.title}

Category: ${formattedCategory}
Date: ${formattedDate}
Location: ${event.location}
Organizer: ${event.organizer}

${changedFieldsText}View Event:
${eventUrl}

Techie Hub
Never miss a tech event in Karachi.

Follow Techie Hub:

Website: ${process.env.SITE_URL}
LinkedIn: ${SOCIAL_LINKS.linkedin}
Instagram: ${SOCIAL_LINKS.instagram}
X: ${SOCIAL_LINKS.x}
Discord: ${SOCIAL_LINKS.discord}
`;
}

/**
 * Creates the HTML version of a single event notification.
 */
export function renderEventNotificationHtml(
  event: EventData,
  operation: EventOperation,
  changedFields: ChangedField[] = []
) {
  const { formattedDate, formattedCategory, eventUrl } =
    renderEventDetails(event);

  const siteUrl = process.env.SITE_URL!;

  const isUpdate = operation === "UPDATE";

  const emailHeading = isUpdate
    ? "An event on Techie Hub has been updated."
    : "A new tech event has been added to Techie Hub.";

  const changedFieldsHtml =
    isUpdate && changedFields.length > 0
      ? `
        <div
          style="
            margin-bottom: 20px;
            padding: 16px;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
          "
        >

          <div
            style="
              margin-bottom: 8px;
              font-size: 13px;
              font-weight: 700;
              color: #111827;
            "
          >
            What changed
          </div>

          <ul
            style="
              margin: 0;
              padding-left: 20px;
              color: #4b5563;
              font-size: 14px;
              line-height: 1.6;
            "
          >
            ${changedFields
              .map(
                (field) =>
                  `<li>${escapeHtml(
                    CHANGE_LABELS[field]
                  )}</li>`
              )
              .join("")}
          </ul>

        </div>
      `
      : "";

  const eventImageHtml = event.image_url
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
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>${escapeHtml(
    isUpdate
      ? `Event Updated: ${event.title}`
      : `New Tech Event: ${event.title}`
  )}</title>
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
          href="${escapeHtml(siteUrl)}"
          target="_blank"
          style="
            display: inline-block;
            text-decoration: none;
          "
        >
          <img
            src="${escapeHtml(
              siteUrl
            )}/logo-horizontal.png"
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

        <!-- Notification heading -->

        <div
          style="
            margin-bottom: 20px;
            font-size: 15px;
            line-height: 1.5;
            color: #4b5563;
          "
        >
          ${escapeHtml(emailHeading)}
        </div>

        ${changedFieldsHtml}

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

        ${eventImageHtml}

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
                href="${escapeHtml(siteUrl)}"
                target="_blank"
                style="
                  display: inline-block;
                  text-decoration: none;
                "
              >
                <img
                  src="${escapeHtml(
                    siteUrl
                  )}/icons/website.png"
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
                href="${escapeHtml(
                  SOCIAL_LINKS.linkedin
                )}"
                target="_blank"
                style="
                  display: inline-block;
                  text-decoration: none;
                "
              >
                <img
                  src="${escapeHtml(
                    siteUrl
                  )}/icons/linkedin.png"
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
                  src="${escapeHtml(
                    siteUrl
                  )}/icons/x.png"
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
                href="${escapeHtml(
                  SOCIAL_LINKS.instagram
                )}"
                target="_blank"
                style="
                  display: inline-block;
                  text-decoration: none;
                "
              >
                <img
                  src="${escapeHtml(
                    siteUrl
                  )}/icons/instagram.png"
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
                href="${escapeHtml(
                  SOCIAL_LINKS.discord
                )}"
                target="_blank"
                style="
                  display: inline-block;
                  text-decoration: none;
                "
              >
                <img
                  src="${escapeHtml(
                    siteUrl
                  )}/icons/discord.png"
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
          © ${new Date().getFullYear()}
          Techie Hub. All rights reserved.
        </div>

      </div>

    </div>

  </div>

</body>
</html>
`;
}

/**
 * Creates the plain-text version of the queued batch email.
 */
export function renderQueuedEventsText(events: EventData[]) {
  const siteUrl = process.env.SITE_URL!;

  return `
New tech events have been added to Techie Hub.

${events
  .map(
    (event, index) => `
${index + 1}. ${event.title}

Category: ${formatCategory(event.category)}
Date: ${formatEventDate(event.event_date)}
Location: ${event.location}
Organizer: ${event.organizer}

View Event:
${siteUrl}/events/${event.id}
`
  )
  .join("\n")}

Techie Hub
Never miss a tech event in Karachi.

Website: ${siteUrl}
LinkedIn: ${SOCIAL_LINKS.linkedin}
Instagram: ${SOCIAL_LINKS.instagram}
X: ${SOCIAL_LINKS.x}
Discord: ${SOCIAL_LINKS.discord}
`;
}

/**
 * Creates the HTML version of the queued batch email.
 */
export function renderQueuedEventsHtml(events: EventData[]) {
  const siteUrl = process.env.SITE_URL!;

  const emailSubject =
    events.length === 1
      ? `New Tech Event: ${events[0].title}`
      : `${events.length} New Tech Events on Techie Hub`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>${escapeHtml(emailSubject)}</title>
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
          href="${escapeHtml(siteUrl)}"
          target="_blank"
          style="
            display: inline-block;
            text-decoration: none;
          "
        >
          <img
            src="${escapeHtml(
              siteUrl
            )}/logo-horizontal.png"
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

        <div
          style="
            margin-bottom: 24px;
            font-size: 15px;
            line-height: 1.5;
            color: #4b5563;
          "
        >
          ${
            events.length === 1
              ? "A new tech event has been added to Techie Hub."
              : `${events.length} new tech events have been added to Techie Hub.`
          }
        </div>

        ${events
          .map(
            (event) => `
              <div
                style="
                  border: 1px solid #e5e7eb;
                  border-radius: 12px;
                  padding: 20px;
                  margin-bottom: 20px;
                "
              >

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
                    margin-bottom: 12px;
                  "
                >
                  ${escapeHtml(
                    formatCategory(event.category)
                  )}
                </div>

                <!-- Title -->

                <h2
                  style="
                    margin: 0 0 16px 0;
                    font-size: 21px;
                    line-height: 1.3;
                    color: #111111;
                  "
                >
                  ${escapeHtml(event.title)}
                </h2>

                <!-- Event Image -->

                ${
                  event.image_url
                    ? `
                      <img
                        src="${escapeHtml(
                          event.image_url
                        )}"
                        alt="${escapeHtml(
                          event.title
                        )}"
                        width="536"
                        style="
                          display: block;
                          width: 100%;
                          max-width: 536px;
                          height: auto;
                          max-height: 240px;
                          object-fit: cover;
                          border-radius: 10px;
                          margin-bottom: 18px;
                          border: 0;
                        "
                      />
                    `
                    : ""
                }

                <!-- Event Details -->

                <div
                  style="
                    font-size: 14px;
                    line-height: 1.7;
                    color: #4b5563;
                    margin-bottom: 18px;
                  "
                >
                  <strong>Date:</strong>
                  ${escapeHtml(
                    formatEventDate(event.event_date)
                  )}
                  <br />

                  <strong>Location:</strong>
                  ${escapeHtml(event.location)}
                  <br />

                  <strong>Organizer:</strong>
                  ${escapeHtml(event.organizer)}
                </div>

                <!-- View Event -->

                <a
                  href="${escapeHtml(
                    `${siteUrl}/events/${event.id}`
                  )}"
                  target="_blank"
                  style="
                    display: inline-block;
                    padding: 10px 18px;
                    background-color: #111111;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                  "
                >
                  View Event
                </a>

              </div>
            `
          )
          .join("")}

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
            margin-bottom: 12px;
            font-size: 13px;
            color: #6b7280;
          "
        >
          Follow Techie Hub
        </div>

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
          © ${new Date().getFullYear()}
          Techie Hub. All rights reserved.
        </div>

      </div>

    </div>

  </div>

</body>
</html>
`;
}