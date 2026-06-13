const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

export const applyVolunteer =
  async (data: any) => {

    const res = await fetch(
      `${BASE_URL}/api/volunteers/apply`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result =
      await res.json();

    if (!res.ok) {
      throw new Error(
        result.message ||
        "Failed to apply"
      );
    }

    return result;
  };