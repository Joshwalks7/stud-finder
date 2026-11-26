import type { BuildabilitySummary } from "../types/inventory";
import { getCurrentAccessToken } from "./cognito";

export async function loadBuildability(
  setNum: string,
): Promise<BuildabilitySummary> {
  const accessToken = await getCurrentAccessToken();
  const headers = new Headers();

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(
    `/api/sets/${encodeURIComponent(setNum)}/buildability`,
    { headers },
  );

  if (response.status === 401) {
    throw new Error("Sign in to calculate buildability.");
  }

  if (!response.ok) {
    throw new Error("Buildability is currently unavailable.");
  }

  return response.json() as Promise<BuildabilitySummary>;
}

