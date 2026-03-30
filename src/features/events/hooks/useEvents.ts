"use client";

import { useState, useEffect } from "react";
import { getEvents} from "../api/event.api";
import { Event } from "../types/event.types";

export const useEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>{
        const fetch = async () => {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (err: any){
                setError(err.message)
            }finally {
                setLoading(false);
            }
            };
        fetch();
    }, [])
    return { events, loading, error};

}