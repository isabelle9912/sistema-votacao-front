import { useState, useEffect } from "react";
import {
  getVotes,
  postVote,
  getCandidates,
  postCandidates,
} from "../services/api";
import { getWsBaseUrl } from "../helpers/baseUrl";

// Interface para o Candidato que vem da API
export interface Candidate {
  id: string;
  nome: string;
}

interface PollResults {
  [key: string]: number;
}

export const useVotingPoll = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<PollResults>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar dados (Candidatos + Votos)
  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Buscamos as duas coisas em paralelo
      const [candidatesData, votesData] = await Promise.all([
        getCandidates(),
        getVotes(),
      ]);

      setCandidates(candidatesData);
      setVotes(votesData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Falha ao carregar a votação.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 1. Carregamento Inicial ---
  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. WebSocket ---
  useEffect(() => {
    const wsUrl = `${getWsBaseUrl()}/votos`;
    // OBS: Se tiver um endpoint diferente para atualizações de CANDIDATOS (ex: novo candidato entrou),
    // precisaria conectar nele também. Por enquanto, vamos assumir que o WS só atualiza votos.

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const updatedVotes = JSON.parse(event.data);
      setVotes(updatedVotes);
    };

    return () => {
      if (ws.readyState === ws.OPEN) ws.close();
    };
  }, []);

  // --- 3. Ações ---

  const handleVote = async (optionId: string) => {
    if (selectedOption) return;
    try {
      setError(null);
      setSelectedOption(optionId);

      await postVote(optionId);
    } catch (err) {
      setError("Erro ao votar.");
    } finally {
      setSelectedOption(null);
    }
  };

  const handleNewCandidate = async (name: string) => {
    try {
      setError(null);
      await postCandidates(name);

      // Após criar, recarregamos a lista para ele aparecer na tela
      // (Idealmente o WS avisaria, mas recarregar funciona para o contexto atual)
      const newCandidates = await getCandidates();
      setCandidates(newCandidates);
      return true;
    } catch (err) {
      setError("Erro ao criar candidato.");
      return false;
    }
  };

  // Calcula total
  const totalVotes = Object.values(votes).reduce((acc, val) => acc + val, 0);

  return {
    candidates,
    votes,
    totalVotes,
    isLoading,
    selectedOption,
    error,
    handleVote,
    handleNewCandidate,
  };
};
