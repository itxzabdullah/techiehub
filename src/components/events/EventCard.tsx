import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

interface EventCardProps {
  event: any;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md">
      <div className="flex-1 p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{new Date(event.date || Date.now()).toLocaleDateString()}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-black">
          {event.title || "Untitled Event"}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {event.description || "No description available."}
        </p>
      </div>
      <div className="border-t border-gray-100 bg-gray-50 p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <MapPin className="h-4 w-4 text-gray-400" />
          {event.location || "Karachi, Pakistan"}
        </div>
      </div>
    </Link>
  );
}
