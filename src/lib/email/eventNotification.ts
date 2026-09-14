import "server-only";

import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

import {
  type EventData,
  type EventOperation,
  type ChangedField,
  renderEventNotificationText,
  renderEventNotificationHtml,
} from "./emailTemplates";

export type {
  EventData,
  EventOperation,
  ChangedField,
} from "./emailTemplates";

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

/**
 * Sends an email notification to all active subscribers
 * when an event is created or updated.
 */
export async function notifySubscribers(
  event: EventData,
  operation: EventOperation,
  changedFields: ChangedField[] = []
) {
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
  // Determine email subject
  // ---------------------------------------------------------

  const isUpdate = operation === "UPDATE";

  const emailSubject = isUpdate
    ? `Event Updated: ${event.title}`
    : `New Tech Event: ${event.title}`;

  // ---------------------------------------------------------
  // Render email content
  // ---------------------------------------------------------

  const text = renderEventNotificationText(
    event,
    operation,
    changedFields
  );

  const html = renderEventNotificationHtml(
    event,
    operation,
    changedFields
  );

  // ---------------------------------------------------------
  // Send emails
  // ---------------------------------------------------------

  const emailPromises = subscribers.map((subscriber) =>
    transporter.sendMail({
      from: `"Techie Hub" <${process.env.GMAIL_USER}>`,
      to: subscriber.email,
      subject: emailSubject,
      text,
      html,
    })
  );

  const results = await Promise.allSettled(emailPromises);

  // ---------------------------------------------------------
  // Count results
  // ---------------------------------------------------------

  const sent = results.filter(
    (result) => result.status === "fulfilled"
  ).length;

  const failed = results.filter(
    (result) => result.status === "rejected"
  ).length;

  // ---------------------------------------------------------
  // Log failures
  // ---------------------------------------------------------

  if (failed > 0) {
    console.error(
      "Some subscriber emails failed:",
      results.filter(
        (result) => result.status === "rejected"
      )
    );
  }

  return {
    sent,
    failed,
  };
}