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
  loadWishlist,
  saveWishlist,
} from "../services/wishlistStorage";

interface WishlistContextValue {
  wishlist: WishlistItem[];
  addToWishlist: (set: RebrickableSet) => void;
  removeFromWishlist: (setNum: string) => void;
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
  const [wishlist, setWishlist] = useState<WishlistItem[]>(
    loadWishlist,
  );

  useEffect(() => {
    saveWishlist(wishlist);
  }, [wishlist]);

  function addToWishlist(set: RebrickableSet): void {
    setWishlist((currentWishlist) => {
      const alreadyExists = currentWishlist.some(
        (item) => item.set.set_num === set.set_num,
      );

      if (alreadyExists) {
        return currentWishlist;
      }

      return [
        ...currentWishlist,
        {
          set,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  }

  function removeFromWishlist(setNum: string): void {
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