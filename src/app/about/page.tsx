import SubscriptionForm from "@/components/about/SubscriptionForm";
import Navbar from "@/components/layout/Navbar";
import {
  FaLinkedinIn,
  FaXTwitter,
  FaDiscord,
} from "react-icons/fa6";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
          {/* Main Card */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white px-7 pt-9 pb-7 shadow-sm sm:px-10 sm:pt-12 sm:pb-10">
            {/* About */}
            <div className="mx-auto max-w-3xl">
              <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                About Techie Hub
              </h1>

              <div className="mt-6 space-y-6 text-base leading-8 text-gray-600 sm:text-lg">
                <p>
                  Techie Hub is an AI-powered event discovery platform designed to
                  discover and share tech-related events happening in Karachi. It
                  allows users to browse upcoming Hackathons, Workshops, Conferences,
                  Meetups, Startups, and more all in one place, with links to the official
                  event sites. Users can also get AI powered personalized event recommendations
                  based on their interests. Community leads, organizers and users can submit event through the
                  designated interface. Submitted events are then reviewed and published to
                  site by admin.
                </p>

                <p>
                  The idea behind Techie Hub is my personal experience
                  while looking for different technology events happening in
                  Karachi. The purpose of the project is to maximize student
                  involvement in different communities so they never miss
                  an opportunity to connect, network, and grow.
                </p>

                <p>
                  The project is still in its early stage. While I am continuously working on enhancing
                  the user experience, if anyone has any suggestions, feature ideas, or anything else
                  you'd like to share, feel free to reach out. Let's grow together, learn
                  together, and help the community flourish.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-10 border-t border-gray-200" />

            {/* Connect */}
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Never miss an update.
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-gray-600">
                Get notified whenever a new tech event is published on Techie Hub.
              </p>

              {/* Subscription Form */}
              <SubscriptionForm />
              <p className="mx-auto mt-7 max-w-xl text-gray-600">
                Connect with Techie Hub
              </p>
              <div className="mt-5 mb-3 flex items-center justify-center gap-4">
                <a
                  href="https://www.linkedin.com/company/techiehub-pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Techie Hub on LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:scale-105 hover:opacity-80"
                >
                  <FaLinkedinIn className="h-4 w-4" />
                </a>

                <a
                  href="https://x.com/techiehub_pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Techie Hub on X"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:scale-105 hover:opacity-80"
                >
                  <FaXTwitter className="h-4 w-4" />
                </a>

                <a
                  href="https://discord.gg/45DGGCDfxb"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Techie Hub on Discord"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:scale-105 hover:opacity-80"
                >
                  <FaDiscord className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}