import { pollOptions } from "../constants/pollOptions";
import { useVotingPoll } from "../hooks/useVotingPoll";
import "./VotingPoll.css";

export const VotingPoll: React.FC = () => {
  const { votes, isLoading, handleVote, totalVotes, selectedOption, error } =
    useVotingPoll();

  return (
    <div className="voting-poll-container">
      <h2>Qual tecnologia do curso você mais gostou?</h2>

      {error && <p className="poll-error">{error}</p>}
      <div className="poll-options">
        {pollOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleVote(option.id)}
            disabled={isLoading}
            // Adicionamos classes dinâmicas para o feedback
            className={`poll-card ${
              selectedOption === option.id ? "loading" : ""
            }`}
            // Usamos a cor do objeto
            style={{ "--option-color": option.color } as React.CSSProperties}
          >
            <img
              src={option.imageUrl}
              alt={`Mascote do ${option.name}`}
              className="poll-card-image"
            />
            <span className="poll-card-name">{option.name}</span>
          </button>
        ))}
      </div>

      <div className="poll-results" aria-live="polite" aria-busy={isLoading}>
        <h3>Resultados Atuais:</h3>
        {pollOptions.map((option) => {
          const count = votes[option.id] || 0;
          const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;

          return (
            <div
              key={option.id}
              className="result-bar-container"
              style={{ "--option-color": option.color } as React.CSSProperties}
            >
              <div className="result-label">
                <span className="result-lable-text">
                  {option.name} ({count})
                </span>
                <span className="result-lable-text">
                  {percentage.toFixed(0)}%
                </span>
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
        <p className="total-votes">Total de Votos: {totalVotes}</p>
      </div>
    </div>
  );
};
