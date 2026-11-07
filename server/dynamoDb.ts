import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { CollectionItem } from "../src/types/collection";
import type { WishlistItem } from "../src/types/wishlist";

const region = process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? "us-east-1";
const collectionTableName = process.env.COLLECTION_TABLE_NAME ?? "StudFinderCollection";
const wishlistTableName = process.env.WISHLIST_TABLE_NAME ?? "StudFinderWishlist";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

interface StoredSetFields {
  setNum: string;
  name: string;
  year: number;
  themeId: number;
  numParts: number;
  imageUrl: string | null;
  setUrl: string;
}

interface StoredCollectionItem extends StoredSetFields {
  userId: string;
  quantity: number;
  addedAt: string;
  updatedAt: string;
}

interface StoredWishlistItem extends StoredSetFields {
  userId: string;
  addedAt: string;
  updatedAt: string;
}

function setFields(item: CollectionItem | WishlistItem): StoredSetFields {
  return {
    setNum: item.set.set_num,
    name: item.set.name,
    year: item.set.year,
    themeId: item.set.theme_id,
    numParts: item.set.num_parts,
    imageUrl: item.set.set_img_url,
    setUrl: item.set.set_url,
  };
}

function toRebrickableSet(item: StoredSetFields) {
  return {
    set_num: item.setNum,
    name: item.name,
    year: item.year,
    theme_id: item.themeId,
    num_parts: item.numParts,
    set_img_url: item.imageUrl,
    set_url: item.setUrl,
  };
}

export async function listCollection(userId: string): Promise<CollectionItem[]> {
  const result = await dynamoDb.send(new QueryCommand({
    TableName: collectionTableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": userId },
  }));

  return (result.Items as StoredCollectionItem[] | undefined ?? []).map((item) => ({
    set: toRebrickableSet(item),
    quantity: item.quantity,
    addedAt: item.addedAt,
  }));
}

export async function saveCollectionItem(
  userId: string,
  item: CollectionItem,
): Promise<void> {
  const now = new Date().toISOString();
  const existing = await dynamoDb.send(new GetCommand({
    TableName: collectionTableName,
    Key: { userId, setNum: item.set.set_num },
  }));
  const previous = existing.Item as StoredCollectionItem | undefined;

  await dynamoDb.send(new PutCommand({
    TableName: collectionTableName,
    Item: {
      userId,
      ...setFields(item),
      quantity: item.quantity,
      addedAt: previous?.addedAt ?? item.addedAt,
      updatedAt: now,
    } satisfies StoredCollectionItem,
  }));
}

export async function updateCollectionQuantity(
  userId: string,
  setNum: string,
  quantity: number,
): Promise<void> {
  await dynamoDb.send(new UpdateCommand({
    TableName: collectionTableName,
    Key: { userId, setNum },
    UpdateExpression: "SET quantity = :quantity, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":quantity": quantity,
      ":updatedAt": new Date().toISOString(),
    },
  }));
}

export async function removeCollectionItem(userId: string, setNum: string): Promise<void> {
  await dynamoDb.send(new DeleteCommand({
    TableName: collectionTableName,
    Key: { userId, setNum },
  }));
}

export async function listWishlist(userId: string): Promise<WishlistItem[]> {
  const result = await dynamoDb.send(new QueryCommand({
    TableName: wishlistTableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": userId },
  }));

  return (result.Items as StoredWishlistItem[] | undefined ?? []).map((item) => ({
    set: toRebrickableSet(item),
    addedAt: item.addedAt,
  }));
}

export async function saveWishlistItem(
  userId: string,
  item: WishlistItem,
): Promise<void> {
  const now = new Date().toISOString();

  await dynamoDb.send(new PutCommand({
    TableName: wishlistTableName,
    Item: {
      userId,
      ...setFields(item),
      addedAt: item.addedAt,
      updatedAt: now,
    } satisfies StoredWishlistItem,
  }));
}

export async function removeWishlistItem(userId: string, setNum: string): Promise<void> {
  await dynamoDb.send(new DeleteCommand({
    TableName: wishlistTableName,
    Key: { userId, setNum },
  }));
}
