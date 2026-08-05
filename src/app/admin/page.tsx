import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminPage() {
  const supabase = await createClient();

const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (error || profile?.role !== "admin") {
  redirect("/");
}

  const email = user.email ?? "";

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
        <LogoutButton />
      </main>
      <Footer />
    </div>
  );
}