import Image from "next/image";
import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Main footer */}
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-56">

          {/* Brand */}
          <div className="max-w-2xl">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-horizontal.png"
                alt="TechieHub"
                width={220}
                height={59}
                className="h-auto w-44 sm:w-48"
              />
            </Link>

            <p className="mt-5 max-w-xl text-sm leading-6 text-gray-500">
              An AI powered event discovery platform for tech related events
              happening in Karachi. Discover Hackathons, AI related events,
              Startup meetups, Workshops, Conferences, University tech gatherings,
              and many more, All in one place.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4 sm:min-w-[120px]">
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

        {/* Bottom */}
        <div className="mt-8 border-t border-gray-100 pt-5">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} TechieHub. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}