"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "AI Recommendations", href: "/recommend" },
];

export default function Navbar() {
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setLoggedIn(!!session);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    setLoggedIn(false);

    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
            TH
          </div>

          <span className="text-xl font-bold tracking-tight text-foreground">
            TechieHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>




          <div className="flex items-center gap-3">
            <Link
              href="/submit-event"
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Submit Event
            </Link>

            {!loggedIn ? (
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-medium transition hover:bg-accent"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="inline-flex h-10 items-center justify-center rounded-full border border-red-500 px-5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>
            )}
          </div>




        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/submit-event"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 flex h-10 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Submit Event
            </Link>

            {!loggedIn ? (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-3 flex h-10 w-full items-center justify-center rounded-full border text-sm font-medium transition hover:bg-accent"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mt-3 flex h-10 w-full items-center justify-center rounded-full border border-red-500 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}