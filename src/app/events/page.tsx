export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import EmptyState from "@/components/EmptyState";
import EventSearchForm from "@/components/events/EventSearchForm";
import { createClient } from "@/lib/supabase/server";

const CATEGORIES = [
  "All",
  "AI",
  "Hackathon",
  "Workshop",
  "Conference",
  "Meetup",
  "Startup",
  "Cybersecurity",
  "Web Development",
  "Exhibition",
  "Mobile Development",
  "Cloud Computing",
  "University Event",
];

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}) {
  const { category, search } = await searchParams;

  const normalizedSearch = search?.trim() || "";
  const normalizedCategory =
    category && category !== "All" ? category.trim() : "";

  const now = new Date().toISOString();
  const supabase = await createClient();

  let upcomingEvents: any[] = [];
  let pastEvents: any[] = [];
  let searchResults: any[] = [];

  /*
   * FILTERED MODE
   *
   * Search and/or category uses the same fuzzy
   * PostgreSQL search function as the homepage.
   *
   * Returns:
   * - past events
   * - upcoming events
   * - all matching results
   * - typo-tolerant results
   * - search + category together
   */
  if (normalizedSearch || normalizedCategory) {
    const { data, error } = await supabase.rpc("search_events", {
      search_query: normalizedSearch || null,
      search_category: normalizedCategory || null,
    });

    if (error) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-red-500">
            Error loading events: {error.message}
          </p>
        </div>
      );
    }

    searchResults = data ?? [];

    /*
     * Split matching results into upcoming and past.
     */
    upcomingEvents = searchResults.filter(
      (event) => new Date(event.event_date) >= new Date(now)
    );

    pastEvents = searchResults.filter(
      (event) => new Date(event.event_date) < new Date(now)
    );
  } else {
    /*
     * NORMAL EXPLORE PAGE
     *
     * No filters:
     * - Upcoming Events
     * - Past Events
     */
    const [
      { data: upcoming, error: upcomingError },
      { data: past, error: pastError },
    ] = await Promise.all([
      supabase
        .from("events")
        .select("*")
        .gte("event_date", now)
        .order("event_date", { ascending: true }),

      supabase
        .from("events")
        .select("*")
        .lt("event_date", now)
        .order("event_date", { ascending: false }),
    ]);

    if (upcomingError || pastError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-red-500">
            Error loading events.
          </p>
        </div>
      );
    }

    upcomingEvents = upcoming ?? [];
    pastEvents = past ?? [];
  }

  const isFiltered =
    Boolean(normalizedSearch) || Boolean(normalizedCategory);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Explore Events
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Find the perfect tech event in Karachi to attend, learn, and
              network.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {/* Search */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                <EventSearchForm
                  search={normalizedSearch}
                  category={normalizedCategory}
                />

                {isFiltered && (
                  <Link
                    href="/events"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Reset Filters
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Sidebar */}
            <aside className="w-full flex-shrink-0 space-y-8 md:w-48 lg:w-52">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Categories
                </h3>

                <div className="mt-4 flex flex-col items-start gap-1.5">
                  <Link
                    href={
                      normalizedSearch
                        ? `/events?search=${encodeURIComponent(normalizedSearch)}`
                        : "/events"
                    }
                    className={`inline-flex w-fit max-w-full rounded-lg px-3 py-2 text-sm transition ${!normalizedCategory
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    All
                  </Link>

                  {CATEGORIES.slice(1).map((item) => {
                    const params = new URLSearchParams();

                    params.set("category", item);

                    if (normalizedSearch) {
                      params.set("search", normalizedSearch);
                    }

                    return (
                      <Link
                        key={item}
                        href={`/events?${params.toString()}`}
                        scroll={false}
                        className={`inline-flex w-fit max-w-full rounded-lg px-3 py-2 text-sm transition ${normalizedCategory.toLowerCase() === item.toLowerCase()
                            ? "bg-black text-white"
                            : "text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        {item}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Events */}
            <section className="flex-1 space-y-12">
              {/* Filter/Search heading */}
              {isFiltered && (
                <div>
                  <h2 className="mb-2 text-2xl font-bold">
                    {normalizedSearch
                      ? `Search Results for "${normalizedSearch}"`
                      : `${normalizedCategory} Events`}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {normalizedSearch && normalizedCategory
                      ? `Showing ${searchResults.length} matching event${searchResults.length !== 1 ? "s" : ""
                      } in ${normalizedCategory}.`
                      : normalizedSearch
                        ? `Showing ${searchResults.length} matching event${searchResults.length !== 1 ? "s" : ""
                        }.`
                        : `Showing ${searchResults.length} ${normalizedCategory} event${searchResults.length !== 1 ? "s" : ""
                        }.`}
                  </p>
                </div>
              )}

              {/* UPCOMING EVENTS */}
              <div>
                <h2 className="mb-6 text-2xl font-bold">
                  Upcoming Events
                </h2>

                {upcomingEvents.length === 0 ? (
                  <EmptyState
                    title="No upcoming events"
                    description={
                      isFiltered
                        ? "No matching upcoming events were found."
                        : "Check back soon."
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {upcomingEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* PAST EVENTS
                  Only render this section when past matching
                  events actually exist. */}
              {pastEvents.length > 0 && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold">
                    Past Events
                  </h2>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {pastEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                      />
                    ))}
                  </div>
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