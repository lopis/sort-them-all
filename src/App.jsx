import { useState } from 'react';
import Game from './game/Game';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = async () => {  
    setGameStarted(true);
  };

  return (
    <>
      <h1>Sort Them All!</h1>
      {gameStarted && <Game /> || (
        <div>
          <p>Use the arrows to re-order the list according with the instructions.</p>
          <button onClick={startGame}>Play</button>
        </div>
      )}
    </>
  );
}

export default App;
