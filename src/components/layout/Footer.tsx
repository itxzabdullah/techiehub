import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
       <div className="grid grid-cols-1 gap-8 sm:grid-cols-[2fr_1fr]">
          
          {/* Logo + Description */}
          <div>
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
              An AI powered event discovery platform for tech related events happening in Karachi
              including Hackathons, Workshops, Conferences, Developer Meetups and many more,
              All in one place.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col items-start gap-3 sm:pt-1">
            <Link
              href="/about"
              className="text-sm text-gray-500 transition hover:text-gray-900"
            >
              About
            </Link>

            <span className="text-sm text-gray-500">
              Contact
            </span>

            <a
              href="https://www.linkedin.com/company/techiehub-pk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TechieHub on LinkedIn"
              className="text-gray-500 transition hover:text-gray-900"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-gray-100 pt-5">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} TechieHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}