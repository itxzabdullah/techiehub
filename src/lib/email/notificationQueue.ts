import "server-only";

import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

import {
    renderQueuedEventsText,
    renderQueuedEventsHtml,
    type EventData,
} from "@/lib/email/emailTemplates";

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

export async function processNotificationQueue() {
    const threeHoursAgo = new Date(
        Date.now() - 3 * 60 * 60 * 1000
    ).toISOString();

    // ---------------------------------------------------------
    // Get events that have been waiting for at least 3 hours
    //
    // created_at controls eligibility.
    // queued_at controls ordering.
    //
    // created_at remains unchanged when an event is updated.
    // queued_at is updated when an already-queued event changes.
    // ---------------------------------------------------------

    // Find the first event in the current batch.
    const { data: oldestItem, error: oldestError } = await supabase
        .from("event_notification_queue")
        .select("id, event_id, created_at, queued_at")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (oldestError) {
        console.error(
            "Notification queue lookup error:",
            oldestError
        );

        throw oldestError;
    }

    if (!oldestItem) {
        return {
            processed: 0,
            sent: 0,
            failed: 0,
        };
    }

    // The 3-hour window starts with the first event.
    if (oldestItem.created_at > threeHoursAgo) {
        return {
            processed: 0,
            sent: 0,
            failed: 0,
        };
    }

    const { data: queuedItems, error: queueError } = await supabase
        .from("event_notification_queue")
        .select("id, event_id, created_at, queued_at")
        .order("queued_at", { ascending: false });

    if (queueError) {
        console.error(
            "Notification queue lookup error:",
            queueError
        );

        throw queueError;
    }

    if (!queuedItems || queuedItems.length === 0) {
        return {
            processed: 0,
            sent: 0,
            failed: 0,
        };
    }

    const eventIds = queuedItems.map(
        (item) => item.event_id
    );

    // ---------------------------------------------------------
    // Get current event data
    //
    // An event may have been updated while waiting in the queue.
    // Always send the latest version of the event.
    // ---------------------------------------------------------

    const { data: events, error: eventsError } = await supabase
        .from("events")
        .select(
            "id, title, category, event_date, location, organizer, image_url"
        )
        .in("id", eventIds);

    if (eventsError) {
        console.error(
            "Queued event lookup error:",
            eventsError
        );

        throw eventsError;
    }

    if (!events || events.length === 0) {
        return {
            processed: 0,
            sent: 0,
            failed: 0,
        };
    }

    // ---------------------------------------------------------
    // Get active subscribers
    // ---------------------------------------------------------

    const { data: subscribers, error: subscriberError } =
        await supabase
            .from("subscribers")
            .select("email")
            .eq("is_active", true);

    if (subscriberError) {
        console.error(
            "Subscriber lookup error:",
            subscriberError
        );

        throw subscriberError;
    }

    if (!subscribers || subscribers.length === 0) {
        return {
            processed: 0,
            sent: 0,
            failed: 0,
        };
    }

    // ---------------------------------------------------------
    // Sort events by most recent queue activity
    //
    // queuedItems is ordered by queued_at DESC, so the event
    // with the most recent queue activity appears first.
    // ---------------------------------------------------------

    const queueOrder = new Map(
        queuedItems.map((item, index) => [
            item.event_id,
            index,
        ])
    );

    events.sort(
        (a, b) =>
            (queueOrder.get(a.id) ?? 0) -
            (queueOrder.get(b.id) ?? 0)
    );

    // ---------------------------------------------------------
    // Render batch email
    // ---------------------------------------------------------

    const emailSubject =
        events.length === 1
            ? `New Tech Event: ${events[0].title}`
            : `${events.length} New Tech Events on Techie Hub`;

    const text = renderQueuedEventsText(
        events as EventData[]
    );

    const html = renderQueuedEventsHtml(
        events as EventData[]
    );

    // ---------------------------------------------------------
    // Send one batch email to every subscriber
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

    if (failed > 0) {
        console.error(
            "Some batch subscriber emails failed:",
            results.filter(
                (result) => result.status === "rejected"
            )
        );
    }

    // ---------------------------------------------------------
    // Delete successfully processed queue records
    //
    // Only remove records after at least one email was sent.
    // ---------------------------------------------------------

    if (sent > 0) {
        const { error: deleteError } = await supabase
            .from("event_notification_queue")
            .delete()
            .in("event_id", eventIds);

        if (deleteError) {
            console.error(
                "Failed to remove processed queue records:",
                deleteError
            );

            throw deleteError;
        }
    }

    return {
        processed: events.length,
        sent,
        failed,
    };
}