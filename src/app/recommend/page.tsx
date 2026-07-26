"use client";
import EventCard from "@/components/events/EventCard";
import { useState } from "react";

export default function RecommendPage() {
  const [interests, setInterests] = useState("");
  const [recommendations, setRecommendations] = useState<
    {
      event: any;
      reason: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRecommend() {
    if (!interests.trim()) {
      setError("Please enter your interests first.");
      return;
    }

    setError("");

    try {
      setLoading(true);
      setRecommendations([]);

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
      setError("");
    } catch (error) {
      setRecommendations([]);
      setError("Failed to generate recommendations. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">
        AI Event Recommender
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
        className="mt-8 h-40 w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-black"
        placeholder="Example: I like AI, cybersecurity, startups and hackathons."
      />

      <button
        onClick={handleRecommend}
        disabled={loading}
        className="mt-6 rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >

        {loading ? "Thinking..." : "Recommend Events"}
      </button>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>

            <div>
              <h3 className="font-semibold text-red-700">
                Something went wrong
              </h3>

              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-medium text-green-700">
            ✅ Found {recommendations.length} AI recommendation
            {recommendations.length > 1 ? "s" : ""} for you.
          </p>
        </div>
      )}

      <div className="mt-10 space-y-5">
        <h2 className="text-2xl font-bold">
          🤖 AI Recommendations
        </h2>

        {loading && (
          <p className="text-gray-500">
            Analyzing your interests...
          </p>
        )}

        {!loading && recommendations.length === 0 && (
          <p className="text-gray-500">
            Your recommendations will appear here.
          </p>
        )}

        {recommendations.map((item) => (
          <div
            key={item.event.id}
            className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              ⭐ AI Pick
            </div>

            <EventCard event={item.event} />

            <div className="rounded-xl border bg-gray-50 p-4">
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
    </main>
  );
}