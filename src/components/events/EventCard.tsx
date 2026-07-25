type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
};

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">{event.title}</h2>

      <p className="mt-3 text-gray-600">
        {event.description}
      </p>

      <div className="mt-4 text-sm text-gray-500">
        📍 {event.location}
      </div>

      <div className="mt-2 font-medium">
        {new Date(event.event_date).toLocaleString()}
      </div>
    </div>
  );
}