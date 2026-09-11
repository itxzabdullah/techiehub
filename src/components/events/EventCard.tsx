import { Event } from "@/types/event";
import { Calendar, MapPin, User, Tag, ExternalLink } from "lucide-react";
import ShareEvent from "@/components/events/ShareEvent";
import Image from "next/image";

interface EventCardProps {
  event: Event;
  priority?: boolean;
}

export default function EventCard({
  event,
  priority = false,
}: EventCardProps) {
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

  const MAX_VISIBLE_TAGS = 8;

  const visibleTags = (event.tags ?? []).slice(0, MAX_VISIBLE_TAGS);

  const remainingTags = Math.max(
    (event.tags?.length ?? 0) - MAX_VISIBLE_TAGS,
    0
  );

  return (
    <div className="group flex h-[840px] min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Image */}
      {event.image_url && (
        <div className="relative h-60 min-h-60 w-full shrink-0 overflow-hidden">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-6">

        {/* Category */}
        <div className="mb-5 inline-flex w-fit shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          {event.category}
        </div>

        {/* Title */}
        <h2 className="mb-4 line-clamp-2 shrink-0 break-words text-2xl font-bold leading-tight text-gray-900">
          {event.title}
        </h2>

        {/* Description */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <p className="break-words leading-7 text-gray-600">
            {event.description}
          </p>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>

        {/* Bottom Section */}
        <div className="mt-6 flex-none">

          {/* Tags */}
          {/* Tags */}
          {visibleTags.length > 0 && (
            <div className="mb-5">
              <div className="flex flex-wrap gap-2">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className="max-w-full truncate rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
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
              <span className="whitespace-nowrap">
                {formattedDate}
              </span>
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
          <div className="mt-5 border-t pt-3">
            <div className="mx-auto flex w-full max-w-sm items-center justify-between px-2">

              {/* Learn More */}
              {event.registration_link && (
                <a
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Learn More
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              {/* Share */}
              <ShareEvent
                id={event.id}
                title={event.title}
              />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}