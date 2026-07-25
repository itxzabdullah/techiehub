export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  image_url: string | null;
  category: string;
  organizer: string;
  is_free: boolean;
  registration_link: string | null;
  created_at: string;
}