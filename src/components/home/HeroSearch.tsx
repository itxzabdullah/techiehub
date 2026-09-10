"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

type HeroSearchProps = {
  search?: string;
  category?: string;
};

export default function HeroSearch({
  search: initialSearch,
  category,
}: HeroSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    initialSearch || ""
  );

  const shouldScrollToResults = useRef(false);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");

    if (!shouldScrollToResults.current) {
      return;
    }

    shouldScrollToResults.current = false;

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

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
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

    if (category) {
      params.set("category", category);
    }

    const query = params.toString();

    if (trimmedSearch) {
      shouldScrollToResults.current = true;
    }

    router.push(
      query ? `/?${query}` : "/",
      {
        scroll: false,
      }
    );
  }

  return (
    <>
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

      {(search || category) && (
        <button
          type="button"
          onClick={handleReset}
          className="mt-3 text-sm font-medium text-gray-500 transition-colors hover:text-black"
        >
          Reset Search & Category
        </button>
      )}
    </>
  );
}