import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { createClient } from "@/lib/supabase/server";
import ReviewSubmission from "@/components/admin/ReviewSubmission";

export default async function ReviewSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

    const { data: submission, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !submission) {
        notFound();
    }
    return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <ReviewSubmission submission={submission} />
      </main>
      <Footer />
    </div>
  );
}
