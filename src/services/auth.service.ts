
export interface LoginPayload {
  email: string;
  password: string;
}

export const authLogin = async (request?: LoginPayload) => {
  const res = await fetch(`http://localhost:3000/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await res.json();
  return data;
};