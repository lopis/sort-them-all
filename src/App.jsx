import { useState, useContext } from 'react';
import Game from './game/Game';
import './App.css';
import ApiDataContext from './api/ApiDataContext';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const { pokemonList } = useContext(ApiDataContext);

  const startGame = async () => {  
    setGameStarted(true);
  };

  return (
    <>
      <h1>Sort Them All!</h1>
      {gameStarted && <Game pokemonList={pokemonList}/> || (
        <div>
          <p>Drag the items of the list to sort them in <strong>ascending</strong> order.</p>
          <button onClick={startGame}>Play</button>
        </div>
      )}
    </>
  );
}

export default App;
