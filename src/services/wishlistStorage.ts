import type { WishlistItem } from "../types/wishlist";

const WISHLIST_STORAGE_KEY = "stud-finder.wishlist";

export function loadWishlist(): WishlistItem[] {
  const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);

  if (!storedWishlist) {
    return [];
  }

  try {
    const parsedWishlist: unknown = JSON.parse(storedWishlist);

    if (Array.isArray(parsedWishlist)) {
      return parsedWishlist as WishlistItem[];
    }

    return [];
  } catch {
    return [];
  }
}

export function saveWishlist(items: WishlistItem[]): void {
  localStorage.setItem(
    WISHLIST_STORAGE_KEY,
    JSON.stringify(items),
  );
}