"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareEventProps {
  id: string;
  title: string;
}

export default function ShareEvent({
  id,
  title,
}: ShareEventProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/events/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this event on Techie Hub: ${title}`,
          url: eventUrl,
        });
      } catch {
        // User cancelled the share sheet.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(eventUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy event link:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      <Share2 className="h-4 w-4" />
      {copied ? "Copied!" : "Share"}
    </button>
  );
}