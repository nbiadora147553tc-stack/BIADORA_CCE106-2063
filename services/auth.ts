export type AuthUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
};

type ApiError = { message?: string };
type UserLookup = { users?: Array<Pick<AuthUser, "username" | "email">> };
type LoginResponse = { accessToken?: string } & ApiError;

export class AuthError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "AuthError";
  }
}

const API_URL = "https://dummyjson.com";

// DummyJSON authenticates with usernames, so resolve the submitted email first.
export async function login(email: string, password: string): Promise<string> {
  const lookupResponse = await fetch(`${API_URL}/users/filter?key=email&value=${encodeURIComponent(email.toLowerCase())}`);
  const lookup = (await lookupResponse.json()) as UserLookup & ApiError;
  if (!lookupResponse.ok) {
    throw new Error(lookup.message ?? "Couldn't find that student account. Check your connection and try again.");
  }
  const account = lookup.users?.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
  if (!account) throw new AuthError("Invalid email or password.", 401);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: account.username, password, expiresInMins: 60 }),
  });
  const data = (await response.json()) as LoginResponse;
  if (!response.ok) throw new AuthError(data.message ?? "Invalid email or password.", response.status);

  // DummyJSON names its JWT field accessToken; store that exact response field.
  if (typeof data.accessToken !== "string" || !data.accessToken) {
    throw new Error("The login response did not include an access token.");
  }
  return data.accessToken;
}

// Read the protected profile with the saved bearer token.
export async function getProtectedUser(accessToken: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await response.json()) as AuthUser & ApiError;
  if (!response.ok) {
    throw new AuthError(data.message ?? "Session expired, please log in again.", response.status);
  }
  return data;
}
