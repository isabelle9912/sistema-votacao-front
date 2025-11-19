import React, { useState } from "react";
import { useVotingPoll } from "../hooks/useVotingPoll";
import { getMascotDetails } from "../helpers/mascotHelper";
import "./VotingPoll.css";

export const VotingPoll: React.FC = () => {
  const {
    candidates,
    votes,
    totalVotes,
    isLoading,
    selectedOption,
    error,
    handleVote,
    handleNewCandidate,
  } = useVotingPoll();

  const [newCandidateName, setNewCandidateName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const onSubmitNewCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName.trim()) return;

    setIsCreating(true);
    const success = await handleNewCandidate(newCandidateName);
    if (success) {
      setNewCandidateName("");
    }
    setIsCreating(false);
  };

  if (isLoading && candidates.length === 0) {
    return (
      <div className="voting-poll-container">
        <p>Carregando sistema...</p>
      </div>
    );
  }

  return (
    <div className="voting-poll-container">
      <h2>Votação em Tempo Real</h2>

      {error && <div className="error-banner">{error}</div>}

      {/* LISTA DE CARDS (DINÂMICA) */}
      <div className="poll-options">
        {candidates.map((candidate) => {
          // Pega cor e imagem baseado no nome dinamicamente
          const { img, color } = getMascotDetails(candidate.nome);

          return (
            <button
              key={candidate.id}
              onClick={() => handleVote(candidate.id)}
              disabled={!!selectedOption} // Desabilita se já estiver votando em alguém
              className={`poll-card ${
                selectedOption === candidate.id ? "loading" : ""
              }`}
              // Usamos a cor do objeto
              style={{ "--option-color": color } as React.CSSProperties}
            >
              <img src={img} alt={candidate.nome} className="poll-card-image" />
              <span className="poll-card-name">{candidate.nome}</span>
            </button>
          );
        })}
      </div>

      {/* FORMULÁRIO DE CADASTRO RÁPIDO */}
      <div className="admin-panel">
        <h3>Cadastrar Nova Opção</h3>
        <form onSubmit={onSubmitNewCandidate} className="add-form">
          <input
            type="text"
            placeholder="Ex: Docker"
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
            disabled={isCreating}
          />
          <button type="submit" disabled={isCreating || !newCandidateName}>
            {isCreating ? "Criando..." : "+ Adicionar"}
          </button>
        </form>
      </div>

      {/* RESULTADOS */}
      <div className="poll-results" aria-live="polite">
        <h3>Resultados ({totalVotes} votos):</h3>
        {candidates.map((candidate) => {
          const { color } = getMascotDetails(candidate.nome);
          const voteKey = candidate.nome.toLowerCase();
          const count = votes[voteKey] || 0;
          const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;

          return (
            <div
              key={candidate.id}
              className="result-bar-container"
              style={{ "--option-color": color } as React.CSSProperties}
            >
              <div className="result-label">
                <span>
                  {candidate.nome} ({count})
                </span>
                <span>{percentage.toFixed(0)}%</span>
              </div>
              <div className="result-bar-background">
                <div
                  className="result-bar-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
