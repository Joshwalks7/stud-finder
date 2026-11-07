/* eslint-disable react-refresh/only-export-components */
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
  loadCollectionFromApi,
  removeCollectionFromApi,
  saveCollectionToApi,
  updateCollectionQuantityInApi,
} from "../services/collectionApi";

interface CollectionContextValue {
  collection: CollectionItem[];
  isLoading: boolean;
  errorMessage: string | null;
  addToCollection: (set: RebrickableSet) => Promise<void>;
  decrementFromCollection: (setNum: string) => Promise<void>;
  removeFromCollection: (setNum: string) => Promise<void>;
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
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCollectionFromApi()
      .then(setCollection)
      .catch((error: unknown) => {
        console.error("Unable to load collection:", error);
        setErrorMessage("Unable to load your collection.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function addToCollection(set: RebrickableSet): Promise<void> {
    const existingItem = collection.find(
      (item) => item.set.set_num === set.set_num,
    );
    const item: CollectionItem = existingItem
      ? { ...existingItem, quantity: existingItem.quantity + 1 }
      : { set, quantity: 1, addedAt: new Date().toISOString() };

    await saveCollectionToApi(item);

    setCollection((currentCollection) => {
      const alreadyExists = currentCollection.some(
        (currentItem) => currentItem.set.set_num === set.set_num,
      );

      return alreadyExists
        ? currentCollection.map((currentItem) =>
          currentItem.set.set_num === set.set_num ? item : currentItem,
        )
        : [...currentCollection, item];
    });
  }

  async function decrementFromCollection(setNum: string): Promise<void> {
    const existingItem = collection.find(
      (item) => item.set.set_num === setNum,
    );

    if (!existingItem) return;

    const nextQuantity = existingItem.quantity - 1;

    if (nextQuantity > 0) {
      await updateCollectionQuantityInApi(setNum, nextQuantity);
      setCollection((currentCollection) =>
        currentCollection.map((item) =>
          item.set.set_num === setNum
            ? { ...item, quantity: nextQuantity }
            : item,
        ),
      );
      return;
    }

    await removeCollectionFromApi(setNum);
    setCollection((currentCollection) =>
      currentCollection.filter((item) => item.set.set_num !== setNum),
    );
  }

  async function removeFromCollection(setNum: string): Promise<void> {
    await removeCollectionFromApi(setNum);
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
        isLoading,
        errorMessage,
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
