import { Event } from "../types/event.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getEvents = async (): Promise<Event[]> => {
  const res = await fetch(`${BASE_URL}/api/events`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);

  return res.json(); // returns plain array
};