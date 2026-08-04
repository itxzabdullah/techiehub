import type { EventBase } from "./event-base";

export interface Event extends EventBase {
  id: string;
  created_at: string;
}