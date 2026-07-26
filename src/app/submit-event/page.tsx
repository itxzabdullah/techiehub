"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default function SubmitEventPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");

  const [registrationLink, setRegistrationLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");

  const [isFree, setIsFree] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuth();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !title.trim() ||
      !description.trim() ||
      !category ||
      !eventDate ||
      !eventTime ||
      !location.trim() ||
      !organizer.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const eventDateTime = `${eventDate}T${eventTime}:00`;

      const { error } = await supabase
        .from("events")
        .insert([
          {
            title,
            description,
            category,
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            event_date: eventDateTime,
            location,
            organizer,
            registration_link: registrationLink || null,
            image_url: imageUrl || null,
            is_free: isFree,
          },
        ]);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess("Event submitted successfully!");

      setTitle("");
      setDescription("");
      setCategory("");
      setTags("");
      setEventDate("");
      setEventTime("");
      setLocation("");
      setOrganizer("");
      setRegistrationLink("");
      setImageUrl("");
      setIsFree(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting the event.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        <Navbar />

        <main className="flex flex-1 items-center justify-center">
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1 py-12 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Submit a Tech Event
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Host a hackathon, workshop, or meetup? Let the tech community in Karachi know.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
                  <p className="mt-1 text-sm text-gray-500">Provide the basic information about your event.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="e.g. AI Karachi Hackathon 2026"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-900">
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    >
                      <option value="">Select a category</option>
                      <option value="ai">AI</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="meetup">Meetup</option>
                      <option value="startup">Startup</option>
                      <option value="exhibition">Exhibition</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="web-dev">Web Development</option>
                      <option value="mobile-dev">Mobile Development</option>
                      <option value="cloud">Cloud Computing</option>
                      <option value="university">University Event</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="Tell us what the event is about..."
                    ></textarea>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="tags"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Tags
                    </label>

                    <input
                      id="tags"
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="AI, Python, Machine Learning, FAST, Beginners"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Separate tags with commas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Date & Location</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-900">
                      Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      id="date"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-900">
                      Time
                    </label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      id="time"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      id="location"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="e.g. IBA City Campus, Karachi or Online"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="organizer"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Organizer
                    </label>

                    <input
                      id="organizer"
                      type="text"
                      value={organizer}
                      onChange={(e) => setOrganizer(e.target.value)}
                      placeholder="e.g. Google Developer Groups Karachi"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="registrationLink"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Registration Link
                      <span className="text-gray-400"> (Optional)</span>
                    </label>

                    <input
                      id="registrationLink"
                      type="url"
                      value={registrationLink}
                      onChange={(e) => setRegistrationLink(e.target.value)}
                      placeholder="https://..."
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="imageUrl"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Event Image URL
                      <span className="text-gray-400"> (Optional)</span>
                    </label>

                    <input
                      id="imageUrl"
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3">
                    <input
                      id="isFree"
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="h-4 w-4"
                    />

                    <label
                      htmlFor="isFree"
                      className="text-sm font-medium text-gray-900"
                    >
                      This is a free event
                    </label>
                  </div>


                </div>
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setCategory("");
                    setTags("");
                    setEventDate("");
                    setEventTime("");
                    setLocation("");
                    setOrganizer("");
                    setRegistrationLink("");
                    setImageUrl("");
                    setIsFree(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-8 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Event"}
                </button>
              </div>


              {success && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-green-700 font-medium">
                    ✅ {success}
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-red-700 font-medium">
                    ⚠️ {error}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
