import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { RebrickableSet } from "../types/rebrickable";
import type { CollectionItem } from "../types/collection";
import {
  loadCollection,
  saveCollection,
} from "../services/collectionStorage";

interface CollectionContextValue {
  collection: CollectionItem[];
  addToCollection: (set: RebrickableSet) => void;
  decrementFromCollection: (setNum: string) => void;
  removeFromCollection: (setNum: string) => void;
  isInCollection: (setNum: string) => boolean;
}

const CollectionContext = createContext<
  CollectionContextValue | undefined
>(undefined);

interface CollectionProviderProps {
  children: ReactNode;
}

export function CollectionProvider({
  children,
}: CollectionProviderProps) {
  const [collection, setCollection] = useState<CollectionItem[]>(
    loadCollection,
  );

  useEffect(() => {
    saveCollection(collection);
  }, [collection]);

  function addToCollection(set: RebrickableSet): void {
    setCollection((currentCollection) => {
      const existingItem = currentCollection.find(
        (item) => item.set.set_num === set.set_num,
      );

      if (existingItem) {
        return currentCollection.map((item) =>
          item.set.set_num === set.set_num
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...currentCollection,
        {
          set,
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  }

  function decrementFromCollection(setNum: string): void {
    setCollection((currentCollection) =>
      currentCollection
        .map((item) =>
          item.set.set_num === setNum
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCollection(setNum: string): void {
    setCollection((currentCollection) =>
      currentCollection.filter(
        (item) => item.set.set_num !== setNum,
      ),
    );
  }

  function isInCollection(setNum: string): boolean {
    return collection.some(
      (item) => item.set.set_num === setNum,
    );
  }

  return (
    <CollectionContext.Provider
      value={{
        collection,
        addToCollection,
        decrementFromCollection,
        removeFromCollection,
        isInCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection(): CollectionContextValue {
  const context = useContext(CollectionContext);

  if (!context) {
    throw new Error(
      "useCollection must be used inside CollectionProvider",
    );
  }

  return context;
}