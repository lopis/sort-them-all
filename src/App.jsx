import { useEffect, useState } from 'react';
import Game from './game/Game';
import './App.css';

const getTimeRemaining = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  const diff = midnight - now;
  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaning] = useState(getTimeRemaining());

  const startGame = async () => {  
    setGameStarted(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaning(getTimeRemaining());
    }, 100);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <>
      <h1>Sort Them All!</h1>
      <div style={{ flexGrow: 1 }}>
        {gameStarted && <Game /> || (
          <div>
            <p>
              Drag the items of the list to sort them in <strong>ascending</strong> order.
            </p>
            <p>
              A new challenge is created each day.
              <br />
              The next challenge will begin in {timeRemaining}.
            </p>
            <button onClick={startGame}>Play</button>
          </div>
        )}
      </div>
      <footer>
        by <a href="https://github.com/lopis/sort-them-all">@lopis</a>
      </footer>
    </>
  );
}

export default App;
