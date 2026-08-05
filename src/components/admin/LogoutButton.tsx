"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-10 rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
    >
      Logout
    </button>
  );
}