export interface EventBase {
  title: string;
  description: string;
  category: string;

  event_date: string;
  location: string;
  organizer: string;

  registration_link: string | null;
  image_url: string | null;

  tags: string[] | null;

  is_free: boolean;
}