import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FaLinkedinIn } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* About */}
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-14 sm:pt-20 sm:pb-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              About TechieHub
            </h1>
          </div>

          <div className="mx-auto mt-10 max-w-4xl space-y-7 text-lg leading-8 text-gray-600">
            <p>
              Techie Hub is a platform designed to discover and share tech
              related events in Karachi. It enables users to browse upcoming
              hackathons, workshops, conferences, AI events, meetups, startups,
              and more all in one place. To submit an event, users can use the
              designated interface to enter event details. Once submitted, the
              events are then reviewed by admin and publised to the site upon
              approval.
            </p>

            <p>
              The motivation behind this project is my personal experience
              while looking for different technology events happening in
              Karachi. The purpose of the project is to maximize the student
              involvement in different communities so that they would never
              miss an opportunity to connect, network, and grow.
            </p>
          </div>
        </section>

        {/* Connect */}
        <section className="mx-auto max-w-3xl px-6 pb-16 sm:pb-20">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 text-center sm:px-10">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Connect with TechieHub
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-gray-600">
              Follow for updates, events, and opportunities.
            </p>

            <a
              href="https://www.linkedin.com/company/techiehub-pk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TechieHub on LinkedIn"
              className="mx-auto mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:opacity-80"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}