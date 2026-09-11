"use client";

import { FormEvent, useState } from "react";

export default function SubscriptionForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      setMessage(data.message || data.error);

      if (response.ok) {
        setEmail("");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-5 flex w-full max-w-lg flex-row items-center gap-2"
      >
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email address"
          required
          disabled={loading}
          className="h-10 sm:h-12 min-w-0 flex-1 rounded-full border border-gray-200 px-3 text-xs sm:text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 disabled:opacity-60 sm:px-5"
        />

        <button
          type="submit"
          disabled={loading}
          className="h-10 sm:h-12 shrink-0 rounded-full bg-black px-3 text-xs sm:text-sm font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
        >
          {loading ? "..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm text-gray-600">
          {message}
        </p>
      )}
    </>
  );
}