import type { WishlistItem } from "../types/wishlist";
import { getCurrentAccessToken } from "./cognito";

async function request<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  const accessToken = await getCurrentAccessToken();

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(input, { ...init, headers });

  if (!response.ok) {
    throw new Error("Unable to communicate with the wishlist API.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function loadWishlistFromApi(): Promise<WishlistItem[]> {
  return request<WishlistItem[]>("/api/wishlist");
}

export function saveWishlistToApi(
  item: WishlistItem,
): Promise<WishlistItem> {
  return request<WishlistItem>("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}

export function removeWishlistFromApi(setNum: string): Promise<void> {
  return request<void>(
    `/api/wishlist/${encodeURIComponent(setNum)}`,
    { method: "DELETE" },
  );
}
