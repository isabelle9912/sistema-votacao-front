// src/services/api.ts
import { getApiBaseUrl } from "../helpers/baseUrl";

const API_URL = getApiBaseUrl();

export const getVotes = async () => {
  const response = await fetch(`${API_URL}/votes`);
  return await response.json();
};

export const postVote = async (optionId: string) => {
  await fetch(`${API_URL}/votes`, {
    method: "POST",
    body: JSON.stringify({ optionId }),
  });
};
