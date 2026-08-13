import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  User,
  Tag,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import ShareEvent from "@/components/events/ShareEvent";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) {
    return {
      title: "Event | Techie Hub",
      description: "Discover tech events in Karachi on Techie Hub.",
    };
  }

  const description =
    event.description.length > 160
      ? `${event.description.slice(0, 157)}...`
      : event.description;

  return {
    title: `${event.title} | Techie Hub`,
    description,

    openGraph: {
      title: event.title,
      description,
      type: "website",
      images: event.image_url
        ? [
          {
            url: event.image_url,
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ]
        : ["/og-image.png"],
    },

    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: event.image_url
        ? [event.image_url]
        : ["/og-image.png"],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event) {
    notFound();
  }


  const date = new Date(event.event_date);

  const formattedDate =
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Karachi",
    }) +
    " • " +
    date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Karachi",
      })
      .toUpperCase() +
    " (PKT)";

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </Link>

        <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          {/* Image */}
          {event.image_url && (
            <div className="h-52 w-full overflow-hidden sm:h-72">
              <img
                src={event.image_url}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-5 sm:p-7">

            {/* Category */}
            <div className="mb-4 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {event.category}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {event.title}
            </h1>

            {/* Organizer */}
            <p className="mt-3 text-gray-500">
              Organized by <span className="font-medium text-gray-700">
                {event.organizer}
              </span>
            </p>

            {/* Details */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Calendar className="h-5 w-5 shrink-0" />
                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <MapPin className="h-5 w-5 shrink-0" />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <User className="h-5 w-5 shrink-0" />
                <span>{event.organizer}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Tag className="h-5 w-5 shrink-0" />
                <span>
                  {event.is_free ? "Free Event" : "Paid Event"}
                </span>
              </div>

            </div>

            {/* Description */}
            <div className="mt-10 border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900">
                About this event
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                {event.description}
              </p>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {event.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-10 border-t pt-6">
              <div className="mx-auto flex w-full max-w-md items-center justify-between">

                {event.registration_link && (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Learn More
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                <ShareEvent
                  id={event.id}
                  title={event.title}
                />

              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}