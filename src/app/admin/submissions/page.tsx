import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function formatCategory(category: string) {
  return category
    .replace("-", " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
}

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const statusFilter =
    status === "approved" || status === "rejected"
      ? status
      : "pending";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    redirect("/");
  }

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("status", statusFilter)
    .order("submitted_at", { ascending: false });

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {error.message}
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-16">
        <h1 className="text-4xl font-bold capitalize">
          {statusFilter} Submissions ({submissions?.length ?? 0})
        </h1>

        <p className="mt-2 text-gray-600">
          Review community-submitted events before publication.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/admin/submissions?status=pending"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${statusFilter === "pending"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            Pending
          </Link>

          <Link
            href="/admin/submissions?status=approved"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${statusFilter === "approved"
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            Approved
          </Link>

          <Link
            href="/admin/submissions?status=rejected"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${statusFilter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            Rejected
          </Link>
        </div>
        {(submissions?.length ?? 0) === 0 ? (
          <div className="mt-10 rounded-2xl border bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold">
              No {statusFilter} submissions
            </h2>

            <p className="mt-2 text-gray-600">
              There are currently no {statusFilter} submissions.
            </p>
            <p className="mt-2 text-gray-600">
              You're all caught up.
            </p>

            <Link
              href="/admin"
              className="mt-6 inline-flex rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl border bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Event
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Submitted By
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {submissions?.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 font-medium">
                      {submission.title}
                    </td>

                    <td className="px-6 py-4">
                      {formatCategory(submission.category)}
                    </td>

                    <td className="px-6 py-4">
                      {submission.submitted_by_name}
                    </td>

                    <td className="px-6 py-4">
                      {new Date(
                        submission.submitted_at
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${submission.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : submission.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {submission.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/submissions/${submission.id}`}
                        className="inline-flex rounded-lg bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}