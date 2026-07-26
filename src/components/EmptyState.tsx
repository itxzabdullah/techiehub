import { CalendarX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({ 
  title = "No events found", 
  description = "Check back later for new tech events happening in Karachi." 
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <CalendarX className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
    </div>
  );
}
