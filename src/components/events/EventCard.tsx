import { Calendar, MapPin, User, Tag, ExternalLink } from "lucide-react";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
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

  const MAX_VISIBLE_TAGS = 8; // adjust if needed

  const visibleTags = (event.tags ?? []).slice(0, MAX_VISIBLE_TAGS);

  const remainingTags = Math.max(
    (event.tags?.length ?? 0) - MAX_VISIBLE_TAGS,
    0
  );

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (event.registration_link) {
      return (
        <a
          href={event.registration_link}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          {children}
        </a>
      );
    }

    return <div className="h-full">{children}</div>;
  };

  return (
    <Wrapper>
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

          {/* Flexible Description */}
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

            {/* Learn More */}
            {event.registration_link && (
              <div className="mt-5 border-t pt-3">
                <span className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition group-hover:bg-gray-800">
                  Learn More
                  <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </Wrapper>
  );
}