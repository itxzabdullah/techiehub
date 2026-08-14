"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type HeroSectionProps = {
  isAdmin: boolean;
  totalEvents: number;
  category?: string;
};

export default function HeroSection({
  isAdmin,
  totalEvents,
  category,
}: HeroSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  /*
   * Tracks whether the current navigation
   * was initiated by the Hero search form.
   */
  const shouldScrollToResults = useRef(false);

  /*
   * Keep the search input synchronized with the URL.
   */
  useEffect(() => {
    setSearch(searchParams.get("search") || "");

    /*
     * Only scroll when THIS component initiated
     * an actual search.
     *
     * Category clicks do not set this ref.
     */
    if (!shouldScrollToResults.current) {
      return;
    }

    shouldScrollToResults.current = false;

    /*
     * Wait until the new server-rendered content
     * has been committed to the DOM.
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const results = document.getElementById(
          "events-results"
        );

        if (results) {
          results.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }, [searchParams]);

  /*
   * Reset search and category.
   */
  function handleReset() {
    router.push("/", {
      scroll: false,
    });

    setSearch("");

    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    });
  }

  /*
   * Search from Hero.
   *
   * - Preserves category.
   * - Uses server-side search.
   * - Does not let Next.js automatically scroll.
   * - Scrolls to results AFTER the new server
   *   content has rendered.
   */
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(
      searchParams.toString()
    );

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }

    /*
     * Preserve selected category.
     */
    if (category) {
      params.set("category", category);
    }

    const query = params.toString();

    /*
     * Tell the effect that this navigation
     * came specifically from Search.
     */
    if (trimmedSearch) {
      shouldScrollToResults.current = true;
    }

    router.push(query ? `/?${query}` : "/", {
      scroll: false,
    });
  }

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
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-12 max-w-3xl"
        >
          <div className="relative flex items-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-gray-300 focus-within:shadow-md">

            <Search className="absolute left-5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              name="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search hackathons, AI events, workshops..."
              className="w-full rounded-2xl bg-transparent py-4 pl-14 pr-32 text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />

            <div className="absolute right-2">
              <Button
                type="submit"
                className="rounded-xl px-6"
              >
                Search
              </Button>
            </div>

          </div>
        </form>

        {/* Reset */}
        {(search || category) && (
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 text-sm font-medium text-gray-500 transition-colors hover:text-black"
          >
            Reset Search & Category
          </button>
        )}

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