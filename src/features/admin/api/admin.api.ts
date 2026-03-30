export async function loginAdmin(data: {
  email: string;
  password: string;
}) {
  const res = await fetch(
    "https://foundationbackendrepo.onrender.com/api/admin/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Login failed");
  }

  return json;
}