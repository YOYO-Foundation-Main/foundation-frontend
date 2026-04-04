import { Event } from "../types/event.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Get all events
export const getEvents = async (): Promise<Event[]> => {
  const res = await fetch(`${BASE_URL}/api/events`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
  return res.json();
};

// ✅ Get single event by ID
export const getEventById = async (id: string): Promise<Event> => {
  const res = await fetch(`${BASE_URL}/api/events/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch event: ${res.status}`);
  const data = await res.json();
  return data?.data || data;
};