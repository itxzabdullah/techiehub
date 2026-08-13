"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

interface EventSearchFormProps {
  search?: string;
  category?: string;
}

export default function EventSearchForm({
  search,
  category,
}: EventSearchFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = inputRef.current?.value.trim() || "";

    const params = new URLSearchParams();

    if (category) {
      params.set("category", category);
    }

    if (value) {
      params.set("search", value);
    }

    const scrollY = window.scrollY;

    router.push(
      params.toString()
        ? `/events?${params.toString()}`
        : "/events",
      { scroll: false }
    );

    // Restore the exact scroll position after navigation.
    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollY,
        behavior: "instant",
      });
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex-1"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search
          className="h-4 w-4 text-gray-400"
          aria-hidden="true"
        />
      </div>

      <input
        ref={inputRef}
        type="text"
        defaultValue={search}
        placeholder="Search events..."
        className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-24 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
      />

      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Search
      </button>
    </form>
  );
}