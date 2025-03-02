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
        <div style={{flexGrow: 1}}>
          <p>
            Drag the items of the list to sort them in <strong>ascending</strong> order.
          </p>
          <p>
            A new challenge is created each day.
          </p>
          <button onClick={startGame}>Play</button>
        </div>
      )}
      <footer>
        by <a href="https://github.com/lopis/sort-them-all">@lopis</a>
      </footer>
    </>
  );
}

export default App;
