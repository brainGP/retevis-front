import { GET, POST, PUT } from "@/apis/axios";
import { deleteCookie } from "cookies-next/client";

export interface PublicUser {
  createdAt?: string;
  email: string;
  emailVerified?: boolean;
  isAdmin: boolean;
  username: string;
  googleLinked?: boolean;
  _id: string;
}

let currentUser: PublicUser | null = null;
let restorePromise: Promise<PublicUser | null> | null = null;
let authRevision = 0;
const AUTH_EVENT = "retevis:auth-changed";
const clearLegacyAuthCookies = () => {
  if (typeof window === "undefined") return;
  ["accessToken", "email", "username", "isAdmin", "_id", "createdAt"].forEach((key) => deleteCookie(key, { path: "/" }));
};
const notifyAuthChanged = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_EVENT));
  try { localStorage.setItem("retevis.authChanged", String(Date.now())); } catch { /* Storage can be disabled. */ }
};

export const getUserData = (): PublicUser | null => {
  clearLegacyAuthCookies();
  return currentUser;
};

export const getLastLoginTimestamp = (email: string): number | null => {
  void email;
  return null;
};

export const saveLastLoginTimestamp = (email: string): void => { void email; };

// Browser profile is a UI hint only. The API always checks the HttpOnly session
// cookie and loads current roles from MongoDB before granting access.
export const isUserLoggedIn = (): PublicUser | false => getUserData() || false;

export const restoreUserSession = (): Promise<PublicUser | null> => {
  if (restorePromise) return restorePromise;
  const requestRevision = authRevision;
  restorePromise = (async () => {
    try {
      const response = await GET({ route: "/api/auth/me" });
      if (requestRevision !== authRevision) return currentUser;
      currentUser = response.data as PublicUser;
      notifyAuthChanged();
      return currentUser;
    } catch {
      if (requestRevision !== authRevision) return currentUser;
      currentUser = null;
      notifyAuthChanged();
      return null;
    }
  })().finally(() => { restorePromise = null; });
  return restorePromise;
};

export const isAdmin = async (): Promise<boolean> => {
  try {
    const response = await GET({ route: "/api/auth/admin" });
    return response.status === 200;
  } catch {
    return false;
  }
};

export const isAdminC = (): boolean => Boolean(getUserData()?.isAdmin);

export const logoutUser = async (): Promise<void> => {
  try { await POST({ route: "/api/auth/logout", body: {} }); } catch { /* Clear the local hint even when offline. */ }
  clearLegacyAuthCookies();
  currentUser = null;
  authRevision += 1;
  notifyAuthChanged();
};

export const saveUserData = async (user: PublicUser): Promise<boolean> => {
  try {
    clearLegacyAuthCookies();
    currentUser = { _id: user._id, username: user.username, email: user.email, emailVerified: user.emailVerified !== false, isAdmin: Boolean(user.isAdmin), createdAt: user.createdAt, googleLinked: Boolean(user.googleLinked) };
    authRevision += 1;
    notifyAuthChanged();
    return true;
  } catch {
    return false;
  }
};

export const updateProfile = async (username: string): Promise<PublicUser> => {
  const response = await PUT({ route: "/api/auth/profile", body: { username } });
  const user = response.data as PublicUser;
  currentUser = { ...user, isAdmin: Boolean(user.isAdmin), googleLinked: Boolean(user.googleLinked) };
  authRevision += 1;
  notifyAuthChanged();
  return currentUser;
};

export const markGoogleLinked = (): void => {
  if (!currentUser) return;
  currentUser = { ...currentUser, googleLinked: true };
  authRevision += 1;
  notifyAuthChanged();
};
