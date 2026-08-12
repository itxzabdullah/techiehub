"use client";

import { Event } from "@/types/event";
import { Calendar, MapPin, User, Tag, ArrowRight, Share2 } from "lucide-react";
import { useState } from "react";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const date = new Date(event.event_date);
  const [copied, setCopied] = useState(false);

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

  const MAX_VISIBLE_TAGS = 8;

  const visibleTags = (event.tags ?? []).slice(0, MAX_VISIBLE_TAGS);

  const remainingTags = Math.max(
    (event.tags?.length ?? 0) - MAX_VISIBLE_TAGS,
    0
  );

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const eventUrl = `${window.location.origin}/events/${event.id}`;

    try {
      await navigator.clipboard.writeText(eventUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy event link:", error);
    }
  };

  return (
    <div className="group flex h-[800px] flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Image */}
      {event.image_url && (
        <div className="h-60 w-full overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">

        {/* Category */}
        <div className="mb-5 inline-flex w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          {event.category}
        </div>

        {/* Title */}
        <h2 className="mb-4 line-clamp-2 text-2xl font-bold leading-tight text-gray-900">
          {event.title}
        </h2>

        {/* Description */}
        <div className="relative h-[170px] overflow-hidden">
          <p className="line-clamp-6 leading-7 text-gray-600">
            {event.description}
          </p>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>

        {/* Bottom Section */}
        <div className="mt-6 flex-none">

          {/* Tags */}
          {visibleTags.length > 0 && (
            <div className="mb-5 h-16 overflow-hidden">
              <div className="flex flex-wrap gap-2">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className="whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}

                {remainingTags > 0 && (
                  <span className="whitespace-nowrap rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                    +{remainingTags} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="space-y-3 text-sm text-gray-700">

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">
                {event.location}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">
                {event.organizer}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 shrink-0" />
              <span>
                {event.is_free ? "Free Event" : "Paid Event"}
              </span>
            </div>

          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-26 border-t pt-3">

            {/* Learn More */}
            {event.registration_link && (
              <a
                href={event.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </a>
            )}

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
              {copied ? "Copied!" : "Share"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}