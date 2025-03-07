import { useEffect, useState } from 'react';
import './App.css';
import MainGame from './game/MainGame';
import { daysSinceStart } from './api/constants';

const getTimeRemaining = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  const diff = midnight - now;
  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaning] = useState(getTimeRemaining());
  const [practice, setPractice] = useState(false);
  const [generation, setGeneration] = useState(0);

  const startGame = () => {  
    setGameStarted(true);
  };

  const startRandom = () => {
    setPractice(true);
    setGameStarted(true);
  };

  const startGen = (gen) => () => {
    setPractice(true);
    setGeneration(gen);
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
        {gameStarted && <MainGame practice={practice} generation={generation} /> || (
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
              <button onClick={startGame}>Play Game #{daysSinceStart}</button>
            </p>
            <p>
              A new challenge is created each day at midnight UTC+0.
              <br />
              The next challenge begins in {timeRemaining}.
            </p>
            <div style={{
              fontSize: '80%',
              background: 'var(--white)',
              borderRadius: 10,
              padding: 10,
              margin: '20px 0',
            }}>
              <h1><strong>Practice</strong></h1>
              <p>
                Practice a random challenge.
              </p>
              <div>
                <div>
                  <div className="buttonGroup" style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 400, margin: 'auto' }}>
                    <button onClick={startRandom}>All Gens</button>
                    <hr  style={{ flexBasis: '100%' }} />
                    <button onClick={startGen(1)}>I</button>
                    <button onClick={startGen(2)}>II</button>
                    <button onClick={startGen(3)}>III</button>
                    <button onClick={startGen(4)}>IV</button>
                    <button onClick={startGen(5)}>V</button>
                    <button onClick={startGen(6)}>VI</button>
                    <button onClick={startGen(7)}>VII</button>
                    <button onClick={startGen(8)}>VIII</button>
                    <button onClick={startGen(9)}>IX</button>
                  </div>
                </div>
              </div>
            </div>
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
