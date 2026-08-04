"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function checkUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // User is not logged in
        if (!session) {
          router.replace("/login");
          return;
        }

        // Verify admin role
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error || profile?.role !== "admin") {
          router.replace("/");
          return;
        }

        setEmail(session.user.email ?? "");
      } catch (err) {
        console.error("Failed to verify admin:", err);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />

        <main className="flex flex-1 items-center justify-center">
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="mx-auto flex-1 w-full max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Review community submissions and publish events to TechieHub.
        </p>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Welcome back 👋
          </h2>

          <p className="mt-2 text-gray-600">
            Logged in as{" "}
            <span className="font-semibold">
              {email}
            </span>
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            href="/submit-event"
            className="rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">
              ➕ Publish Event
            </h2>

            <p className="mt-2 text-gray-600">
              Create and publish a new technology event for the TechieHub
              community.
            </p>
          </Link>

          <Link
            href="/admin/submissions"
            className="rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">
              📝 Pending Submissions
            </h2>

            <p className="mt-2 text-gray-600">
              Review community-submitted events before they appear on
              TechieHub.
            </p>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </main>

      <Footer />
    </div>
  );
}