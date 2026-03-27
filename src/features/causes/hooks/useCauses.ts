"use client";

import { useEffect, useState } from "react";
import { getCauses } from "../api/causes.api";
import { Cause } from "../types/cause.types";

export const useCauses = () => {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCauses();
        setCauses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { causes, loading, error };
};