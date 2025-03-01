import { useState } from 'react';
import Game from './game/Game';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = async () => {  
    setGameStarted(true);
  };

  return (
    <>
      {gameStarted && <Game /> || <button onClick={startGame}>Play</button>}
    </>
  );
}

export default App;
