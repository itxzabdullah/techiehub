import Image from "next/image";
import Link from "next/link";
import {
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
  FaDiscord,
  FaEnvelope,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-6 lg:px-8">

        {/* Main footer */}
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-56">

          {/* Brand */}
          <div className="max-w-2xl">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-horizontal.png"
                alt="Techie Hub"
                width={220}
                height={59}
                className="h-auto w-44 invert sm:w-48"
              />
            </Link>

            <p className="mt-5 max-w-xl text-sm leading-6 text-gray-400">
              An AI powered event discovery platform for tech related events
              happening in Karachi. Discover Hackathons, AI related events,
              Startup meetups, Workshops, Conferences, University tech gatherings,
              and many more, All in one place.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4 sm:min-w-[140px] sm:self-end">
            <Link
              href="/about"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              About
            </Link>

            <a
              href="mailto:techiehub-pk@proton.me"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Contact
            </a>

            {/* Social Links */}
            <div className="mt-1 flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/techiehub-pk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Techie Hub on LinkedIn"
                className="text-gray-400 transition hover:text-white"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>

              <a
                href="https://x.com/techiehub_pk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Techie Hub on X"
                className="text-gray-400 transition hover:text-white"
              >
                <FaXTwitter className="h-4 w-4" />
              </a>

              <a
                href="https://www.instagram.com/techiehub_pk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Techie Hub on Instagram"
                className="text-gray-400 transition hover:text-white"
              >
                <FaInstagram className="h-4 w-4" />
              </a>

              <a
                href="https://discord.gg/45DGGCDfxb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Techie Hub on Discord"
                className="text-gray-400 transition hover:text-white"
              >
                <FaDiscord className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-gray-800 pt-5">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Techie Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}