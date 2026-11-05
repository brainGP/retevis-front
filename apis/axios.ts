import { baseUrl } from "@/lib/staticData";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const buildAPIUrl = (route: string) => {
  if (!baseUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured.");
  const base = new URL(baseUrl);
  if (base.protocol !== "http:" && base.protocol !== "https:") {
    throw new Error("Backend URL must use HTTP or HTTPS.");
  }
  return `${base.toString().replace(/\/$/, "")}${route}`;
};
const requestConfig = (token?: string): AxiosRequestConfig => ({
  timeout: 10000,
  withCredentials: true,
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});
let refreshPromise: Promise<unknown> | null = null;
const client = axios.create({ withCredentials: true });
client.interceptors.response.use((response) => response, async (error: AxiosError) => {
  const original = error.config as (AxiosRequestConfig & { _retevisRetried?: boolean }) | undefined;
  const url = original?.url || "";
  if (typeof window === "undefined" || error.response?.status !== 401 || !original || original._retevisRetried ||
      /\/api\/auth\/(?:login|register|google|refresh|logout)/.test(url)) throw error;
  original._retevisRetried = true;
  refreshPromise ||= client.post(buildAPIUrl("/api/auth/refresh"), {}).finally(() => { refreshPromise = null; });
  await refreshPromise;
  return client.request(original);
});
export type body = object | FormData;
interface MyRequest {
  route: string;
  token?: string;
}

interface MyBodyRequest extends MyRequest {
  body: body;
}

export const GET = async ({ route, token }: MyRequest) => {
  const url = buildAPIUrl(route);
  return client.get(url, requestConfig(token));
};

export const DELETE = async ({ route, token }: MyRequest) => {
  const url = buildAPIUrl(route);
  return client.delete(url, requestConfig(token));
};

export const PUT = async ({ route, token, body }: MyBodyRequest) => {
  const url = buildAPIUrl(route);
  return client.put(url, body, {
    ...requestConfig(token),
    timeout: body instanceof FormData ? 60000 : 10000,
  });
};

export const POST = async ({ route, token, body }: MyBodyRequest) => {
  const url = buildAPIUrl(route);
  const isFormData = body instanceof FormData;

  const config: AxiosRequestConfig = {
    timeout: isFormData ? 60000 : 10000,
    withCredentials: true,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  };

  return client.post(url, body, config);
};
