export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginRequest(payload: LoginPayload) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login gagal");
  }

  return data;
}