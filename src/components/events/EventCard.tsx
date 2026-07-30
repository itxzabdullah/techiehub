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

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (event.registration_link) {
      return (
        <a
          href={event.registration_link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {children}
        </a>
      );
    }

    return <div>{children}</div>;
  };

  return (
    <Wrapper>
      <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        {/* Event Image */}
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-56 w-full object-cover"
          />
        )}

        <div className="space-y-5 p-6">
          {/* Category */}
          <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {event.category}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900">
            {event.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600">
            {event.description}
          </p>
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
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

          {/* Details */}
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{event.organizer}</span>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{event.is_free ? "Free Event" : "Paid Event"}</span>
            </div>
          </div>

          {/* Registration */}
          {event.registration_link && (
            <div className="pt-3 border-t">
              <span className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition group-hover:bg-gray-800">
                Learn More
                <ExternalLink className="h-4 w-4" />
              </span>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}