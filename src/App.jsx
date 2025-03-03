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
      <h1><a href="">Sort Them All!</a></h1>
      <div style={{ flexGrow: 1 }}>
        {gameStarted && <Game /> || (
          <div>
            <p>
              Drag the items of the list to sort them in <strong>ascending</strong> order according to the given criteria.
              You have 4 chances to guess the correct order.
            </p>
            <p>
              Keep in mind that some Pokémon species occur in <strong>multiple forms</strong> with different stats.
              Pay attention to their image when sorting them.
            </p>
            <p>
              A new challenge is created each day at midnight UTC+0.
              <br />
              The next challenge begins in {timeRemaining}.
            </p>
            <p>
              <button onClick={startGame}>Play</button>
            </p>
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
