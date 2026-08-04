"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

import type { Submission } from "@/types/submission";

export default function ReviewSubmissionPage() {
    const { id } = useParams();
    const router = useRouter();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [formData, setFormData] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function initialize() {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                // User not logged in
                if (!session) {
                    router.replace("/login");
                    return;
                }

                // Verify admin role
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", session.user.id)
                    .single();

                if (profileError || profile?.role !== "admin") {
                    router.replace("/");
                    return;
                }

                // Load submission
                const { data, error } = await supabase
                    .from("submissions")
                    .select("*")
                    .eq("id", id as string)
                    .single();

                if (error) {
                    if (!cancelled) {
                        setError(error.message);
                    }
                    return;
                }

                if (!cancelled) {
                    setSubmission(data);
                    setFormData(data);
                }
            } catch (err) {
                console.error("Failed to load submission:", err);

                if (!cancelled) {
                    setError("Something went wrong.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (id) {
            initialize();
        }

        return () => {
            cancelled = true;
        };
    }, [id, router]);

    useEffect(() => {
        if (!submission || !formData) {
            setHasUnsavedChanges(false);
            return;
        }

        setHasUnsavedChanges(
            JSON.stringify(submission) !== JSON.stringify(formData)
        );
    }, [submission, formData]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!hasUnsavedChanges) return;

            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);







    async function handleReject() {
        if (!submission) return;

        const confirmed = window.confirm(
            "Reject this submission?\n\nThis submission will be marked as rejected."
        );

        if (!confirmed) return;

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.replace("/login");
                return;
            }

            const { error } = await supabase
                .from("submissions")
                .update({
                    status: "rejected",
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: session.user.id,
                })
                .eq("id", submission.id);

            if (error) {
                throw error;
            }

            alert("Submission rejected successfully.");
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Failed to reject submission.");
        }
    }
    function handleCancel() {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                "You have unsaved changes.\n\nLeave anyway?"
            );

            if (!confirmed) return;
        }

        router.push("/admin/submissions");
    }
    async function handleApprove() {
        if (!formData) return;

        const confirmed = window.confirm(
            "Publish this event?\n\nThis event will become visible to the public."
        );

        if (!confirmed) return;

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.replace("/login");
                return;
            }

            // Publish event
            const { error: insertError } = await supabase
                .from("events")
                .insert({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    event_date: formData.event_date,
                    location: formData.location,
                    organizer: formData.organizer,
                    registration_link: formData.registration_link,
                    image_url: formData.image_url,
                    tags: formData.tags,
                    is_free: formData.is_free,
                });

            if (insertError) {
                throw insertError;
            }

            // Mark submission as approved
            const { error: updateError } = await supabase
                .from("submissions")
                .update({
                    status: "approved",
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: session.user.id,
                })
                .eq("id", submission!.id);

            if (updateError) {
                throw updateError;
            }

            alert("Event published successfully.");

            setHasUnsavedChanges(false);
            router.push("/admin/submissions");
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Failed to publish event.");
        }
    }
    if (loading) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50">
                <Navbar />

                <main className="flex flex-1 items-center justify-center">
                    <p className="text-gray-600">Loading submission...</p>
                </main>

                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50">
                <Navbar />

                <main className="flex flex-1 items-center justify-center">
                    <p className="text-red-600">{error}</p>
                </main>

                <Footer />
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50">
                <Navbar />

                <main className="flex flex-1 items-center justify-center">
                    <p className="text-gray-600">Submission not found.</p>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />

            <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
                <h1 className="text-4xl font-bold">
                    Review Submission
                </h1>
                <p className="mt-2 text-gray-600">
                    Review the event before publishing it to TechieHub.
                </p>
                <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">
                    <div className="grid gap-6 md:grid-cols-2">

                        {/* Title */}
                        <div>
                            <label className="mb-1 block text-sm text-gray-500">
                                Title
                            </label>

                            <input
                                value={formData?.title ?? ""}
                                onChange={(e) =>
                                    setFormData((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                title: e.target.value,
                                            }
                                            : prev
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="mb-1 block text-sm text-gray-500">
                                Category
                            </label>

                            <input
                                value={formData?.category ?? ""}
                                onChange={(e) =>
                                    setFormData((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                category: e.target.value,
                                            }
                                            : prev
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="mb-1 block text-sm text-gray-500">
                                Event Date
                            </label>

                            <input
                                type="datetime-local"
                                value={formData?.event_date?.slice(0, 16) ?? ""}
                                onChange={(e) =>
                                    setFormData((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                event_date: e.target.value,
                                            }
                                            : prev
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="mb-1 block text-sm text-gray-500">
                                Location
                            </label>

                            <input
                                value={formData?.location ?? ""}
                                onChange={(e) =>
                                    setFormData((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                location: e.target.value,
                                            }
                                            : prev
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        {/* Organizer */}
                        <div>
                            <label className="mb-1 block text-sm text-gray-500">
                                Organizer
                            </label>

                            <input
                                value={formData?.organizer ?? ""}
                                onChange={(e) =>
                                    setFormData((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                organizer: e.target.value,
                                            }
                                            : prev
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        {/* Free */}
                        <div>
                            <label className="mb-1 block text-sm text-gray-500">
                                Event Type
                            </label>

                            <select
                                value={formData?.is_free ? "true" : "false"}
                                onChange={(e) =>
                                    setFormData((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                is_free: e.target.value === "true",
                                            }
                                            : prev
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            >
                                <option value="true">Free</option>
                                <option value="false">Paid</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm text-gray-500">
                                Description
                            </label>

                            <textarea
                                rows={6}
                                value={formData?.description ?? ""}
                                onChange={(e) =>
                                    setFormData((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                description: e.target.value,
                                            }
                                            : prev
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        {/* Registration */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm text-gray-500">
                                Registration Link
                            </label>

                            <input
                                value={formData?.registration_link ?? ""}
                                onChange={(e) =>
                                    setFormData((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                registration_link: e.target.value,
                                            }
                                            : prev
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        {/* Image */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm text-gray-500">
                                Image URL
                            </label>

                            <input
                                value={formData?.image_url ?? ""}
                                onChange={(e) =>
                                    setFormData((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                image_url: e.target.value,
                                            }
                                            : prev
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />

                            {formData?.image_url && (
                                <img
                                    src={formData.image_url}
                                    alt={formData.title}
                                    className="mt-4 max-h-72 rounded-xl border object-cover"
                                />
                            )}
                        </div>

                        {/* Tags */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm text-gray-500">
                                Tags
                            </label>

                            <input
                                value={formData?.tags?.join(", ") ?? ""}
                                onChange={(e) =>
                                    setFormData((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                tags: e.target.value
                                                    .split(",")
                                                    .map((tag) => tag.trim())
                                                    .filter(Boolean),
                                            }
                                            : prev
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Submitted By
                            </p>

                            <p>{submission?.submitted_by_name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Email
                            </p>

                            <p>{submission?.submitted_by_email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Submitted At
                            </p>

                            <p>
                                {new Date(submission!.submitted_at).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Status
                            </p>

                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                {submission?.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">

                    <button
                        onClick={handleCancel}
                        className="rounded-lg border px-5 py-2"
                    >
                        Cancel
                    </button>

                    <div className="flex gap-3">

                        <button
                            onClick={handleReject}
                            className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
                        >
                            Reject
                        </button>

                        <button
                            onClick={handleApprove}
                            className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
                        >
                            Approve & Publish
                        </button>

                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}