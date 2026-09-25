export type AuthUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};

type LoginResponse = AuthUser & { accessToken?: string; token?: string };

export class AuthError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "AuthError";
  }
}

const API_URL = "https://dummyjson.com";

// Exchange demo credentials for an access token.
export async function login(username: string, password: string): Promise<string> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
  const data = (await response.json()) as LoginResponse & { message?: string };

  if (!response.ok) {
    throw new AuthError(data.message ?? "Those login details weren’t accepted.", response.status);
  }

  const token = data.accessToken ?? data.token;
  if (!token) throw new Error("The login response did not include an access token.");
  return token;
}

// Send the token as a Bearer credential to the protected profile endpoint.
export async function getProtectedUser(accessToken: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await response.json()) as AuthUser & { message?: string };

  if (!response.ok) {
    throw new AuthError(data.message ?? "Your session has expired. Please log in again.", response.status);
  }
  return data;
}
