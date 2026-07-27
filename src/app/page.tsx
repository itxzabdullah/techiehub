import EventCard from "@/components/events/EventCard";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error: {error.message}</p>
      </main>
    );
  }

  const totalEvents = events?.length ?? 0;

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
      <HeroSection totalEvents={totalEvents} />
      <CategorySection categories={categories} />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section>
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              Upcoming Events
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover the latest technology events happening across Karachi.
            </p>
          </div>
          {events && events.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <h3 className="text-xl font-semibold">
                No events available
              </h3>

              <p className="mt-2 text-muted-foreground">
                Check back soon for upcoming technology events in Karachi.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}