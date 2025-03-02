import { useState, useContext } from 'react';
import Game from './game/Game';
import './App.css';
import { ApiDataContext } from './api/ApiDataProvider.jsx';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const { pokemonList, loading, error } = useContext(ApiDataContext);

  const startGame = async () => {  
    setGameStarted(true);
  };

  return (
    <>
      <h1>Sort Them All!</h1>
      {gameStarted && <Game pokemonList={pokemonList}/> || (
        <div>
          <p>Use the arrows to re-order the list according with the instructions.</p>
          <button onClick={startGame}>Play</button>
        </div>
      )}
    </>
  );
}

export default App;
