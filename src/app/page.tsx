export const dynamic = "force-dynamic";
import SubscriptionForm from "@/components/about/SubscriptionForm";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/types/event";

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

  const eventsPromise =
    normalizedSearch || normalizedCategory
      ? supabaseServer.rpc("search_events", {
        search_query: normalizedSearch || null,
        search_category: normalizedCategory || null,
      })
      : supabaseServer
        .from("events")
        .select("*")
        .gte("event_date", now)
        .order("event_date", { ascending: true })
        .limit(6);

  const authPromise = supabaseServer.auth.getUser();

  const totalEventsPromise = supabaseServer
    .from("events")
    .select("*", {
      count: "exact",
      head: true,
    });

  const [
    {
      data: { user },
    },
    eventsResult,
    { count: totalEvents },
  ] = await Promise.all([
    authPromise,
    eventsPromise,
    totalEventsPromise,
  ]);

  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabaseServer
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.role === "admin";
  }

  const events: Event[] = eventsResult.data ?? [];
  const error = eventsResult.error;

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
        search={normalizedSearch}
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
                {events.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    priority={index === 0}
                  />
                ))}
              </div>

              {/* Only show View All on the normal homepage */}
              {!normalizedSearch && !normalizedCategory && (
                <div className="mt-10 flex justify-center">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-all hover:border-gray-300 hover:bg-gray-50 hover:gap-3"
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
            <div className="mx-auto max-w-6xl rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 px-6 py-10 text-center shadow-sm sm:px-10 md:px-16 md:py-12">
              <div className="mx-auto max-w-3xl">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                  Never miss a tech event in Karachi.
                </h2>

                <p className="mt-3 text-gray-600">
                  Subscribe to get notified when new tech events are added to Techie Hub.
                </p>

                <SubscriptionForm />
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}