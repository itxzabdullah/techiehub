import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
            <span className="font-bold leading-none tracking-tighter">
              TH
            </span>
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            TechieHub
          </span>
        </Link>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500">
          The premier AI-powered event discovery platform for technology
          events, hackathons, workshops, conferences, and developer meetups
          across Karachi.
        </p>

        <div className="mt-6 border-t border-gray-100 pt-5">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} TechieHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}