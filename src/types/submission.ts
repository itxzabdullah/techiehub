import type { EventBase } from "./event-base";

export interface Submission extends EventBase {
  id: string;

  submitted_by_name: string;
  submitted_by_email: string;

  status: "pending" | "approved" | "rejected";

  submitted_at: string;

  reviewed_at: string | null;
  reviewed_by: string | null;

  user_id: string | null;
}