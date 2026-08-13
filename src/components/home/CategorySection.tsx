"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface CategorySectionProps {
  categories: string[];
  search?: string;
  category?: string;
}

export default function CategorySection({
  categories,
  search,
  category,
}: CategorySectionProps) {
  const pathname = usePathname();

  const allCategories = ["All", ...categories];

  return (
    <section className="w-full bg-white px-4 pt-2 pb-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4">
          <h2 className="mb-5 text-2xl font-bold tracking-tight text-gray-900">
            Browse by Category
          </h2>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {allCategories.map((item) => {
              const isAll = item === "All";

              const params = new URLSearchParams();

              // Preserve search when changing category
              if (search?.trim()) {
                params.set("search", search.trim());
              }

              // "All" means no category filter
              if (!isAll) {
                params.set("category", item);
              }

              const query = params.toString();

              const href = query
                ? `${pathname}?${query}`
                : pathname;

              const isActive = isAll
                ? !category
                : category?.toLowerCase() === item.toLowerCase();

              return (
                <Link
                  key={item}
                  href={href}
                  scroll={false}
                  className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}