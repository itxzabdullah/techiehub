import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import EmptyState from "@/components/EmptyState";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  "All",
  "AI",
  "Hackathons",
  "Workshops",
  "Conferences",
  "Meetups",
  "Startups",
  "Cybersecurity",
  "Web Development",
];

export default async function ExplorePage() {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error loading events: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1">
        <div className="border-b border-gray-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Explore Events
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Find the perfect tech event in Karachi to attend, learn, and
              network.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Search events..."
                  className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {CATEGORIES.slice(0, 5).map((category, idx) => (
                  <button
                    key={category}
                    className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      idx === 0
                        ? "bg-black text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Sidebar */}
            <aside className="w-full flex-shrink-0 space-y-8 md:w-64">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Categories
                </h3>

                <div className="mt-4 space-y-3">
                  {CATEGORIES.slice(1).map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />

                      <span className="text-sm text-gray-600">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Events */}
            <section className="flex-1">
              {!events || events.length === 0 ? (
                <EmptyState
                  title="No events found"
                  description="Try adjusting your search or filters."
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}