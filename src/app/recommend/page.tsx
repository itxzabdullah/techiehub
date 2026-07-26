"use client";

import { useState } from "react";
import EventCard from "@/components/events/EventCard";
import type { Event } from "@/types/event";

interface Recommendation {
  event: Event;
  reason: string;
}

export default function RecommendPage() {
  const [interests, setInterests] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleRecommend() {
    if (!interests.trim()) {
      setError("Please enter your interests first.");
      return;
    }

    setLoading(true);
    setRecommendations([]);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setRecommendations(data.recommendations || []);
      setMessage(data.message || "");
    } catch (err) {
      console.error(err);
      setRecommendations([]);
      setError("Failed to generate recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold">
        🤖 AI Event Recommender
      </h1>

      <p className="mt-3 text-gray-600">
        Tell us what you're interested in and TechieHub AI will recommend the
        best technology events in Karachi.
      </p>

      <textarea
        value={interests}
        onChange={(e) => {
          setInterests(e.target.value);

          if (error) setError("");
        }}
        className="mt-8 h-40 w-full rounded-xl border p-4 outline-none transition focus:ring-2 focus:ring-black"
        placeholder="Example: I like AI, cybersecurity, startups and hackathons."
      />

      <button
        onClick={handleRecommend}
        disabled={loading}
        className="mt-6 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Thinking..." : "Recommend Events"}
      </button>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <h3 className="font-semibold text-red-700">
            Something went wrong
          </h3>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="font-medium text-blue-700">
            ℹ️ {message}
          </p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-medium text-green-700">
            ✅ Found {recommendations.length} AI recommendation
            {recommendations.length > 1 ? "s" : ""}.
          </p>
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-bold">
          AI Recommendations
        </h2>

        {loading && (
          <div className="mt-6 animate-pulse rounded-2xl border bg-white p-6 shadow-sm">
            <div className="h-5 w-48 rounded bg-gray-200" />

            <div className="mt-6 h-56 rounded-xl bg-gray-100" />

            <div className="mt-6 h-4 w-2/3 rounded bg-gray-200" />
          </div>
        )}

        {!loading &&
          recommendations.length === 0 &&
          !error &&
          !message && (
            <div className="mt-6 rounded-xl border border-dashed p-10 text-center">
              <h3 className="text-lg font-semibold">
                🤖 No recommendations yet
              </h3>

              <p className="mt-2 text-gray-500">
                Enter your interests and TechieHub AI will recommend the best
                events for you.
              </p>
            </div>
          )}

        <div className="mt-8 space-y-8">
          {recommendations.map((item, index) => (
            <div
              key={item.event.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="rounded-full bg-black px-3 py-1 text-sm font-medium text-white">
                  #{index + 1}
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  🤖 AI Recommended
                </span>
              </div>

              <EventCard event={item.event} />

              <div className="mt-5 rounded-xl border bg-gray-50 p-4">
                <h3 className="font-semibold">
                  Why this matches you
                </h3>

                <p className="mt-2 text-gray-600">
                  {item.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}