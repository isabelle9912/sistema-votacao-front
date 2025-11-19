/**
 * Retorna a base URL da API (ex: http://localhost:8080)
 * - Usa VITE_API_URL se estiver definida
 * - Caso contrário, monta automaticamente com o domínio do front-end
 */
export function getApiBaseUrl() {
  const envApiUrl = "http://localhost:8080";

  if (envApiUrl) return envApiUrl;
  return `${window.location.origin}`;
}

/**
 * Retorna a base URL do WebSocket correspondente
 * - Converte http -> ws e https -> wss
 * - Mantém o mesmo caminho (/api/v1)
 */
export function getWsBaseUrl() {
  const apiBase = getApiBaseUrl();
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return apiBase.replace(/^http(s?):/, wsProtocol);
}
