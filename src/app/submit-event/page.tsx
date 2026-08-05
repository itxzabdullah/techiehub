"use client";
import { fromZonedTime } from "date-fns-tz";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";

export default function SubmitEventPage() {

  const [title, setTitle] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{
    full_name: string;
    role: string;
  } | null>(null);

  const [submittedByName, setSubmittedByName] = useState("");
  const [submittedByEmail, setSubmittedByEmail] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");

  const [registrationLink, setRegistrationLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [tags, setTags] = useState("");

  const [isFree, setIsFree] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const isAdmin = profile?.role === "admin";

  const pageTitle = isAdmin ? "Publish an Event" : "Submit an Event";

  const pageDescription = isAdmin
    ? "Administrator Mode\nThis event will be published immediately."
    : "Contribute to the growth of Karachi's tech community.\nYour submission will be reviewed before publication.";


  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Guest
      if (!user) {
        return;
      }
      setUser(user);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Failed to load profile:", error);
        return;
      }
      setProfile(profileData);
    }
    loadUser();
  }, []);

  useEffect(() => {
  return () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
  };
}, [previewUrl]);


  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setTags("");
    setEventDate("");
    setEventTime("");
    setLocation("");
    setOrganizer("");
    setRegistrationLink("");
    setImageFile(null);
    setIsFree(true);
    setSubmittedByName("");
    setSubmittedByEmail("");
    setPreviewUrl(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !title.trim() ||
      !description.trim() ||
      !category ||
      !eventDate ||
      !eventTime ||
      !location.trim() ||
      !organizer.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!user) {
      if (!submittedByName.trim() || !submittedByEmail.trim()) {
        setError("Please provide your name and email.");
        return;
      }
      const emailRegex = /\S+@\S+\.\S+/;

      if (!emailRegex.test(submittedByEmail)) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    setLoading(true);

    try {

      let imageUrl: string | null = null;

      if (imageFile) {


        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/jpg",
        ];

        if (!allowedTypes.includes(imageFile.type)) {
          setError("Only JPG, JPEG, PNG and WebP images are allowed.");
          return;
        }

        if (imageFile.size > 5 * 1024 * 1024) {
          setError("Image must be smaller than 5 MB.");
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
        setUploadingImage(false);
      }

      const localDate = `${eventDate} ${eventTime}:00`;

      const eventDateTime = fromZonedTime(
        localDate,
        "Asia/Karachi"
      ).toISOString();

      const eventData = {
        title,
        description,
        category,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),

        event_date: eventDateTime,
        location,
        organizer,
        registration_link: registrationLink || null,
        image_url: imageUrl,
        is_free: isFree,
      };

      let table = "events";
      let insertData: Record<string, any> = eventData;

      if (!isAdmin) {
        table = "submissions";

        insertData = {
          ...eventData,

          submitted_by_name: user
            ? profile?.full_name
            : submittedByName,

          submitted_by_email: user
            ? user.email
            : submittedByEmail,

          user_id: user?.id ?? null,
        };
      }

      const { error } = await supabase
        .from(table)
        .insert([insertData]);

      if (error) {
        setError(error.message);
        return;
      }

      const successMessage = isAdmin
        ? "Event published successfully."
        : "Your event has been submitted successfully.\n\nIt will be reviewed before appearing on TechieHub.";

      setSuccess(successMessage);

      resetForm();

    } catch (err) {
      setUploadingImage(false);
      console.error(err);
      //setError("Something went wrong while submitting the event.");
      console.error("Submit Error:", error);
    } finally {
      setUploadingImage(false);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1 py-12 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {pageTitle}
            </h1>
            <p className="mt-4 whitespace-pre-line text-lg text-gray-500">
              {pageDescription}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {!user && (
                <div className="space-y-6 mb-8">
                  <h2 className="text-2xl font-semibold">User Details</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      disabled={loading}
                      value={submittedByName}
                      onChange={(e) => setSubmittedByName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-lg border px-4 py-3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled={loading}
                      value={submittedByEmail}
                      onChange={(e) => setSubmittedByEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border px-4 py-3"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Event Information</h2>
                  <p className="mt-1 text-sm text-gray-500">Provide the basic information about your event.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      disabled={loading}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="e.g. AI Karachi Hackathon 2026"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-900">
                      Category
                    </label>
                    <select
                      id="category"
                      disabled={loading}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    >
                      <option value="">Select a category</option>
                      <option value="ai">AI</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="meetup">Meetup</option>
                      <option value="startup">Startup</option>
                      <option value="exhibition">Exhibition</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="web-dev">Web Development</option>
                      <option value="mobile-dev">Mobile Development</option>
                      <option value="cloud">Cloud Computing</option>
                      <option value="university">University Event</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                      Description
                    </label>
                    <textarea
                      id="description"
                      disabled={loading}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="Tell us what the event is about..."
                    ></textarea>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="tags"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Tags
                    </label>

                    <input
                      id="tags"
                      type="text"
                      disabled={loading}
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="AI, Python, Machine Learning, FAST, Beginners"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Separate tags with commas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-900">
                      Date
                    </label>
                    <input
                      type="date"
                      disabled={loading}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      id="date"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-900">
                      Time
                    </label>
                    <input
                      type="time"
                      disabled={loading}
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      id="time"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                      Location
                    </label>
                    <input
                      type="text"
                      disabled={loading}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      id="location"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="e.g. IBA City Campus, Karachi or Online"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="organizer"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Organizer
                    </label>

                    <input
                      id="organizer"
                      type="text"
                      disabled={loading}
                      value={organizer}
                      onChange={(e) => setOrganizer(e.target.value)}
                      placeholder="e.g. Google Developer Groups Karachi"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="registrationLink"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Registration Link
                      <span className="text-gray-400"> (Optional)</span>
                    </label>

                    <input
                      id="registrationLink"
                      type="url"
                      disabled={loading}
                      value={registrationLink}
                      onChange={(e) => setRegistrationLink(e.target.value)}
                      placeholder="https://..."
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Event Image
                      <span className="text-gray-400"> (Optional)</span>
                    </label>

                    <input
                      id="image"
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={loading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (!file) return;

                        if (!file.type.startsWith("image/")) {
                          setError("Please select a valid image.");
                          return;
                        }

                        if (file.size > 5 * 1024 * 1024) {
                          setError("Image must be smaller than 5 MB.");
                          return;
                        }

                        setError("");

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
                        alt="Preview"
                          width={800}
                          height={450}
                          className="mt-4 h-64 w-full rounded-xl border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (previewUrl?.startsWith("blob:")) {
                              URL.revokeObjectURL(previewUrl);
                            }

                            setImageFile(null);
                            setPreviewUrl(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }

                          }}
                          className="mt-3 rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Remove Image
                        </button>
                      </>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG or WebP. Maximum file size: 5 MB.
                    </p>

                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3">
                    <input
                      id="isFree"
                      type="checkbox"
                      disabled={loading}
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="h-4 w-4"
                    />

                    <label
                      htmlFor="isFree"
                      className="text-sm font-medium text-gray-900"
                    >
                      This is a free event
                    </label>
                  </div>


                </div>
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    resetForm();
                    setError("");
                    setSuccess("");
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-8 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Submitting..."
                    : isAdmin
                      ? "Publish Event"
                      : "Submit Event"}
                </button>
              </div>
              {success && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="whitespace-pre-line text-green-700 font-medium">
                    ✅ {success}
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-red-700 font-medium">
                    ⚠️ {error}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
