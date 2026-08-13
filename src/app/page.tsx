export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}) {
  const { search, category } = await searchParams;

  const normalizedSearch = search?.trim() || "";
  const normalizedCategory = category?.trim() || "";
  const now = new Date().toISOString();

  const supabaseServer = await createClient();

  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabaseServer
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.role === "admin";
  }

  let events: any[] = [];
  let error: any = null;

  /*
   * SEARCH
   *
   * Uses PostgreSQL pg_trgm through the
   * search_events() Supabase RPC function.
   *
   * - Searches all events
   * - Includes past and upcoming events
   * - No result limit
   * - Supports fuzzy/typo-tolerant matching
   */
  if (normalizedSearch || normalizedCategory) {
    const result = await supabaseServer.rpc("search_events", {
      search_query: normalizedSearch || null,
      search_category: normalizedCategory || null,
    });

    events = result.data ?? [];
    error = result.error;
  } else {
    const result = await supabaseServer
      .from("events")
      .select("*")
      .gte("event_date", now)
      .order("event_date", { ascending: true })
      .limit(6);

    events = result.data ?? [];
    error = result.error;
  }
  /*
   * Total number of events
   *
   * Used by the HeroSection statistics.
   */
  const { count: totalEvents } = await supabaseServer
    .from("events")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">
          Error: {error.message}
        </p>
      </main>
    );
  }

  const categories = [
    "AI",
    "Hackathon",
    "Workshop",
    "Conference",
    "Meetup",
    "Startup",
    "Cybersecurity",
    "Web Development",
    "Mobile Development",
    "Cloud",
    "Exhibition",
    "University",
  ];

  return (
    <>
      <Navbar />

      <HeroSection
        isAdmin={isAdmin}
        totalEvents={totalEvents ?? 0}
        category={normalizedCategory}
      />

      <CategorySection
        categories={categories}
        search={normalizedSearch}
        category={normalizedCategory}
      />

      <main className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8">
        <section id="events-results" className="scroll-mt-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">
              {normalizedSearch
                ? `Search Results for "${normalizedSearch}"`
                : normalizedCategory
                  ? `${normalizedCategory} Events`
                  : "Upcoming Events"}
            </h2>

            <p className="mt-2 text-muted-foreground">
              {normalizedSearch
                ? `Showing all events matching "${normalizedSearch}".`
                : normalizedCategory
                  ? `Showing all ${normalizedCategory} events.`
                  : "Discover the latest technology events happening across Karachi."}
            </p>
          </div>

          {events.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                  />
                ))}
              </div>

              {/* Only show View All on the normal homepage */}
              {!normalizedSearch && !normalizedCategory && (
                <div className="mt-10 flex justify-center">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 text-sm font-medium text-black transition-all hover:gap-3"
                  >
                    View all events
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <h3 className="text-xl font-semibold">
                {normalizedSearch || normalizedCategory
                  ? "No events found"
                  : "No events available"}
              </h3>

              <p className="mt-2 text-muted-foreground">
                {normalizedSearch
                  ? `No events matched "${normalizedSearch}".`
                  : normalizedCategory
                    ? `No ${normalizedCategory} events were found.`
                    : "Check back soon for upcoming technology events in Karachi."}
              </p>
            </div>
          )}
        </section>

        {!isAdmin && (
          <section className="mt-20">
            <div className="max-w-2xl rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-sm md:p-10">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                  Know about a tech event?
                </h2>

                <p className="mt-3 text-lg text-gray-600">
                  Submit here and contribute to the growth of Karachi's tech community.
                </p>

                <Link
                  href="/submit-event"
                  className="mt-6 inline-flex items-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-800"
                >
                  Submit Event
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}