// src/services/api.ts
import { getApiBaseUrl } from "../helpers/baseUrl";

const API_URL = getApiBaseUrl();

export const getCandidates = async () => {
  const response = await fetch(`${API_URL}/candidatos`);
  return await response.json();
};

export const postCandidates = async (optionName: string) => {
  await fetch(`${API_URL}/candidatos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome: optionName }),
  });
};

export const postVote = async (optionId: string) => {
  await fetch(`${API_URL}/votos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ candidato_id: optionId }),
  });
};
