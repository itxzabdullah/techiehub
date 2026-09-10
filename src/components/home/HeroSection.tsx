import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSearch from "@/components/home/HeroSearch";

type HeroSectionProps = {
  isAdmin: boolean;
  totalEvents: number;
  category?: string;
  search?: string;
};

export default function HeroSection({
  isAdmin,
  totalEvents,
  category,
  search,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white px-4 pt-16 pb-16 sm:px-6 lg:px-8 lg:pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#f3f4f6,_white_65%)]" />

      <div className="mx-auto max-w-6xl text-center">

        {/* Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
          Discover the Best
          <br className="hidden sm:block" />
          <span className="text-black">
            {" "}
            Tech Events in Karachi
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-6 text-gray-600 sm:text-xl">
          Discover Hackathons, AI related events, Startup meetups,
          Workshops, Conferences, University tech gatherings, and many
          more, happening across Karachi, All in one place.
        </p>

        {/* Search */}
        <HeroSearch
          search={search}
          category={category}
        />

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link href="/events">
            <Button
              size="lg"
              className="rounded-full px-8"
            >
              Explore Events
            </Button>
          </Link>

          {isAdmin ? (
            <Link href="/admin">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8"
              >
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/recommend">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8"
              >
                Get AI Recommendations
              </Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-3 gap-8 border-t border-gray-200 pt-6">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {totalEvents}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Tech Events
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-gray-900">
              12
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Categories
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-gray-900">
              Karachi
            </p>
            <p className="mt-1 text-sm text-gray-500">
              City Focus
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}