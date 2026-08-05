"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

import type { Submission } from "@/types/submission";

type Props = {
    submission: Submission;
};

export default function ReviewSubmission({
    submission,
}: Props) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] =
        useState<Submission>(submission);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [hasUnsavedChanges, setHasUnsavedChanges] =
        useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        submission.image_url
    );

    useEffect(() => {
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

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    async function getSession() {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            router.replace("/login");
            return null;
        }

        return session;
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

    async function handleReject() {
        const confirmed = window.confirm(
            "Reject this submission?\n\nThis submission will be marked as rejected."
        );

        if (!confirmed) return;

        try {
            const session = await getSession();

            if (!session) return;

            const { error } = await supabase
                .from("submissions")
                .update({
                    status: "rejected",
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: session.user.id,
                })
                .eq("id", submission.id);

            if (error) throw error;

            alert("Submission rejected successfully.");
            setHasUnsavedChanges(false);

            router.replace("/admin/submissions");
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Failed to reject submission.");
        }
    }

    async function handleApprove() {
        const confirmed = window.confirm(
            "Publish this event?\n\nThis event will become visible to the public."
        );

        if (!confirmed) return;

        try {
            const session = await getSession();

            if (!session) return;

            let imageUrl = formData.image_url;

            if (imageFile) {

                if (!imageFile.type.startsWith("image/")) {
                    alert("Please select a valid image.");
                    return;
                }

                if (imageFile.size > 5 * 1024 * 1024) {
                    alert("Image must be smaller than 5 MB.");
                    return;
                }

                const fileName =
                    `${crypto.randomUUID()}-${imageFile.name.replace(/\s+/g, "-")}`;
                setUploadingImage(true);
                const { error: uploadError } = await supabase.storage
                    .from("event-images")
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from("event-images")
                    .getPublicUrl(fileName);

                imageUrl = data.publicUrl;

                const { error: submissionUpdateError } = await supabase
                    .from("submissions")
                    .update({
                        image_url: imageUrl,
                    })
                    .eq("id", submission.id);

                if (submissionUpdateError) {
                    throw submissionUpdateError;
                }
                setUploadingImage(false);

                if (
                    imageFile &&
                    formData.image_url?.includes("/storage/v1/object/public/event-images/")
                ) {
                    const oldPath = formData.image_url.split("/event-images/")[1];

                    const { error: deleteError } = await supabase.storage
                        .from("event-images")
                        .remove([oldPath]);

                    if (deleteError) {
                        console.error("Failed to delete old image:", deleteError);
                    }
                }
            }

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
                    image_url: imageUrl ?? formData.image_url,
                    tags: formData.tags,
                    is_free: formData.is_free,
                });

            if (insertError) throw insertError;

            const { error: updateError } = await supabase
                .from("submissions")
                .update({
                    status: "approved",
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: session.user.id,
                })
                .eq("id", submission.id);

            if (updateError) throw updateError;

            alert("Event published successfully.");

            setHasUnsavedChanges(false);

            router.replace("/admin/submissions");
            router.refresh();
        } catch (err) {
            setUploadingImage(false);
            console.error(err);
            alert("Failed to publish event.");
        }
    }
    return (
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
                            value={formData.title}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
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
                            value={formData.category}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    category: e.target.value,
                                }))
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
                            value={formData.event_date.slice(0, 16)}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    event_date: e.target.value,
                                }))
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
                            value={formData.location}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    location: e.target.value,
                                }))
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
                            value={formData.organizer}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    organizer: e.target.value,
                                }))
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
                            value={formData.is_free ? "true" : "false"}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    is_free: e.target.value === "true",
                                }))
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
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
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
                            value={formData.registration_link ?? ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    registration_link: e.target.value,
                                }))
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        />
                    </div>

                    {/* Image */}
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm text-gray-500">
                            Event Image
                        </label>

                        <input
                            id="image"
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (!file) return;

                                if (!file.type.startsWith("image/")) {
                                    alert("Please select an image.");
                                    return;
                                }

                                if (file.size > 5 * 1024 * 1024) {
                                    alert("Image must be smaller than 5 MB.");
                                    return;
                                }

                                if (previewUrl?.startsWith("blob:")) {
                                    URL.revokeObjectURL(previewUrl);
                                }

                                setImageFile(file);
                                setPreviewUrl(URL.createObjectURL(file));
                            }}
                            className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-white file:transition-colors file:hover:bg-gray-800"
                        />
                        {imageFile && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected: {imageFile.name}
                            </p>
                        )}

                        {uploadingImage && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-black" />
                                Uploading image...
                            </div>
                        )}
                        {previewUrl && (
                            <>
                                <Image
                                    src={previewUrl}
                                    alt={formData.title}
                                    width={800}
                                    height={450}
                                    className="mt-4 max-h-72 rounded-xl border object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (previewUrl?.startsWith("blob:")) {
                                            URL.revokeObjectURL(previewUrl);
                                        }

                                        setImageFile(null);

                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                        }

                                        setPreviewUrl(formData.image_url ?? null);
                                    }}
                                    className="mt-3 rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    Remove Image
                                </button>
                            </>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                            JPG, PNG or WebP. Maximum file size: 5 MB.
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm text-gray-500">
                            Tags
                        </label>

                        <input
                            value={formData.tags?.join(", ") ?? ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    tags: e.target.value
                                        .split(",")
                                        .map((tag) => tag.trim())
                                        .filter(Boolean),
                                }))
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Submitted By
                        </p>

                        <p>{submission.submitted_by_name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p>{submission.submitted_by_email}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Submitted At
                        </p>

                        <p>
                            {new Date(submission.submitted_at).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Status
                        </p>

                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                            {submission.status}
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
    );
}