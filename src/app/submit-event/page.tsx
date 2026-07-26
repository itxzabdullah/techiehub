import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SubmitEventPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />
      
      <main className="flex-1 py-12 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Submit a Tech Event
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Host a hackathon, workshop, or meetup? Let the tech community in Karachi know.
            </p>
          </div>
          
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
            <form className="space-y-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
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
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                    >
                      <option value="">Select a category</option>
                      <option value="ai">AI</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="workshop">Workshop</option>
                      <option value="meetup">Meetup</option>
                      <option value="startup">Startup</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="Tell us what the event is about..."
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 pt-8 border-t border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Date & Location</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-900">
                      Date
                    </label>
                    <input
                      type="date"
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
                      id="location"
                      className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="e.g. IBA City Campus, Karachi or Online"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-8 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Submit Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
