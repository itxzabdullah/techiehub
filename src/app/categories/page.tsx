import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const CATEGORIES = [
  { name: "AI", count: 12, slug: "ai" },
  { name: "Hackathon", count: 5, slug: "hackathon" },
  { name: "Workshop", count: 18, slug: "workshop" },
  { name: "Conference", count: 3, slug: "conference" },
  { name: "Meetup", count: 24, slug: "meetup" },
  { name: "Startup", count: 8, slug: "startup" },
  { name: "Cybersecurity", count: 4, slug: "cybersecurity" },
  { name: "Web Development", count: 15, slug: "web-dev" },
  { name: "Mobile Development", count: 9, slug: "mobile-dev" },
  { name: "Cloud Computing", count: 6, slug: "cloud" },
  { name: "Exhibition", count: 7, slug: "exhibition" },
  { name: "University Events", count: 21, slug: "university" },
];

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />
      
      <main className="flex-1 py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Browse by Category
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Discover technology events in Karachi tailored to your specific interests and professional goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/explore?category=${category.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {category.count} upcoming events
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors group-hover:bg-black group-hover:text-white">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}