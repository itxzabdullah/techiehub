import Link from "next/link";

interface CategorySectionProps {
  categories: string[];
}

export default function CategorySection({
  categories,
}: CategorySectionProps) {
  return (
    <section className="w-full bg-white px-4 pt-2 pb-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4">
          <h2 className="mb-5 text-2xl font-bold tracking-tight text-gray-900">
            Browse by Category
          </h2>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/events?category=${encodeURIComponent(category)}`}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                {category === "ai"
                  ? "AI"
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}