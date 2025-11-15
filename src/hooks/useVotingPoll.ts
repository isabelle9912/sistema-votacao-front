import { useState, useEffect } from "react";
import { getVotes, postVote } from "../services/api";
import { getWsBaseUrl } from "../helpers/baseUrl";

// Interface para os resultados
interface PollResults {
  [key: string]: number;
}

const initialVotesState: PollResults = {
  golang: 0,
  react: 0,
  redis: 0,
  cassandra: 0,
};

export const useVotingPoll = () => {
  // Estado para guardar os votos
  const [votes, setVotes] = useState<PollResults>(initialVotesState);

  // Estado para o carregamento inicial da página
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Estado para o carregamento de um voto específico
  const [error, setError] = useState<string | null>(null);

  // Estado de erro
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // --- PASSO 1: Buscar votos iniciais (GET /votes) ---
  useEffect(() => {
    const fetchInitialVotes = async () => {
      try {
        setError(null);
        setIsLoading(true);

        // Chama a função da sua camada de serviço
        const initialVotes = await getVotes();

        setVotes(initialVotes);
      } catch (err) {
        console.error("Falha ao buscar votos:", err);
        setError("Não foi possível carregar os resultados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialVotes();
  }, []); // [] = Roda apenas uma vez quando o componente montar

  // --- PASSO 2: Abrir conexão WebSocket para tempo real ---
  useEffect(() => {
    // Usamos sua função helper para obter a URL do WS
    // Vamos supor que o backend vá expor o endpoint em /votes/ws
    const wsUrl = `${getWsBaseUrl()}/votes/ws`;

    console.log(`Conectando ao WebSocket em ${wsUrl}`);
    const ws = new WebSocket(wsUrl);

    // O que fazer quando uma mensagem (novo total de votos) chegar
    ws.onmessage = (event) => {
      console.log("Recebida atualização de votos via WS:", event.data);
      const updatedVotes = JSON.parse(event.data);
      setVotes(updatedVotes); // Atualiza o estado com os dados do backend
    };

    // Lidar com erros de conexão
    ws.onerror = (err) => {
      console.error("Erro no WebSocket:", err);
      setError("Erro de conexão com o servidor de tempo real.");
    };

    // Lidar com o fechamento
    ws.onclose = () => {
      console.log("Conexão WebSocket fechada.");
    };

    // Função de limpeza: Fecha o WebSocket quando o componente "morrer"
    return () => {
      if (ws.readyState === ws.OPEN) {
        ws.close();
      }
    };
  }, []); // [] = Roda apenas uma vez para abrir a conexão

  // --- PASSO 3: Função para ENVIAR o voto (POST /votes) ---
  const handleVote = async (optionId: string) => {
    // Evita múltiplos cliques
    if (selectedOption) return;

    try {
      setError(null);
      setSelectedOption(optionId); // Inicia o "loading" no botão

      // Chama a função da sua camada de serviço
      await postVote(optionId);

      // SUCESSO!
      // Note que NÃO fazemos setVotes(..) aqui.
      // O backend em Go vai processar o voto, e ENVIAR
      // uma mensagem via WebSocket para TODOS os clientes.
      // O `ws.onmessage` acima vai cuidar da atualização.
      // Isso garante que todos vejam o mesmo resultado ao mesmo tempo.
    } catch (err) {
      console.error("Falha ao votar:", err);
      setError("Seu voto não pôde ser registrado. Tente novamente.");
    } finally {
      // Libera o botão, mesmo que a atualização do WS
      // demore alguns milissegundos para chegar
      setSelectedOption(null);
    }
  };

  // Calcula o total de votos
  const totalVotes = Object.values(votes).reduce(
    (acc, count) => acc + count,
    0
  );

  return { votes, isLoading, handleVote, totalVotes, selectedOption, error };
};
