import "./App.css";
import { VotingPoll } from "./components/VotingPoll";

function App() {
  return (
    <>
      <header>
        {/* Título baseado no slide de abertura */}
        <h1>Escalabilidade na Prática: Sistema de Votação</h1>
        <p>Minicurso SNCT</p>
      </header>
      <main>
        <VotingPoll />
      </main>
    </>
  );
}

export default App;
