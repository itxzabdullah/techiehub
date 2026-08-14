import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FaLinkedinIn } from "react-icons/fa";

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
                  event sites. Users can also get AI powered personalized, event suggestions
                  based on their interests. To submit an event, users can use the
                  designated interface to enter event details. Once submitted, the
                  events are then reviewed by admin and published to the site upon approval.
                </p>

                <p>
                  The idea behind Techie Hub is my personal experience
                  while looking for different technology events happening in
                  Karachi. The purpose of the project is to maximize student
                  involvement in different communities so that they would never miss
                  an opportunity to connect, network, and grow. The project is
                  in its early stage hence focused on providing the
                  core functionality. I am consistently working on enhancing
                  the user experience.
                </p>

                <p>
                  If you have any suggestions, a feature idea, or anything else
                  you'd like to share, feel free to reach out. I am looking
                  forward to hearing from you. Let's grow together, learn
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
                Follow Techie Hub on LinkedIn to stay updated.
              </p>

              <a
                href="https://www.linkedin.com/company/techiehub-pk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Techie Hub on LinkedIn"
                className="mx-auto mt-5 mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:scale-105 hover:opacity-80"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}