/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { RebrickableSet } from "../types/rebrickable";
import type { WishlistItem } from "../types/wishlist";
import {
  loadWishlistFromApi,
  removeWishlistFromApi,
  saveWishlistToApi,
} from "../services/wishlistApi";

interface WishlistContextValue {
  wishlist: WishlistItem[];
  isLoading: boolean;
  errorMessage: string | null;
  addToWishlist: (set: RebrickableSet) => Promise<void>;
  removeFromWishlist: (setNum: string) => Promise<void>;
  isInWishlist: (setNum: string) => boolean;
}

const WishlistContext = createContext<
  WishlistContextValue | undefined
>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({
  children,
}: WishlistProviderProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadWishlistFromApi()
      .then(setWishlist)
      .catch((error: unknown) => {
        console.error("Unable to load wishlist:", error);
        setErrorMessage("Unable to load your wishlist.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function addToWishlist(set: RebrickableSet): Promise<void> {
    const alreadyExists = wishlist.some(
      (item) => item.set.set_num === set.set_num,
    );

    if (alreadyExists) return;

    const item: WishlistItem = {
      set,
      addedAt: new Date().toISOString(),
    };

    await saveWishlistToApi(item);
    setWishlist((currentWishlist) => [...currentWishlist, item]);
  }

  async function removeFromWishlist(setNum: string): Promise<void> {
    await removeWishlistFromApi(setNum);
    setWishlist((currentWishlist) =>
      currentWishlist.filter(
        (item) => item.set.set_num !== setNum,
      ),
    );
  }

  function isInWishlist(setNum: string): boolean {
    return wishlist.some(
      (item) => item.set.set_num === setNum,
    );
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        errorMessage,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider",
    );
  }

  return context;
}
