import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  totalEvents: number;
}

export default function HeroSection({ totalEvents }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#f3f4f6,_white_65%)]" />

      <div className="mx-auto max-w-5xl text-center">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
          Discover the Best
          <br className="hidden sm:block" />
          <span className="text-black">Tech Events in Karachi</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">
          Discover hackathons, AI events, startup meetups, workshops,
          conferences, cybersecurity events, university tech gatherings, and
          developer communities happening across Karachi.
        </p>

        {/* Search UI */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="relative flex items-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-gray-300 focus-within:shadow-md">
            <Search className="absolute left-5 h-5 w-5 text-gray-400" />

            <Link href="/events" className="flex-1">
              <input
                type="text"
                placeholder="Search hackathons, AI events, workshops..."
                readOnly
                className="w-full cursor-pointer rounded-2xl bg-transparent py-4 pl-14 pr-32 text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </Link>

            <div className="absolute right-2">
              <Link href="/events">
                <Button className="rounded-xl px-6">
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/events">
            <Button size="lg" className="rounded-full px-8">
              Explore Events
            </Button>
          </Link>

          <Link href="/recommend">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8"
            >
              AI Recommendations
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8 border-t border-gray-200 pt-8">
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
            <p className="mt-1 text-sm text-gray-500">Tech Events</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="mt-1 text-sm text-gray-500">Categories</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-gray-900">Karachi</p>
            <p className="mt-1 text-sm text-gray-500">City Focus</p>
          </div>
        </div>
      </div>
    </section>
  );
}