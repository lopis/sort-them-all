import { useEffect, useState } from 'react';
import './App.css';
import MainGame from './game/MainGame';
import { gameNumber } from './api/constants';
import Menu from './components/Menu';
import StatusBar from './components/StatusBar';

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
  const [gameKey, setGameKey] = useState(0);
  const [isPracticeOpen, setPracticeOpen] = useState(false);

  const startGame = () => {  
    setTimeout(() => {
      setGameStarted(true);
    }, 150);
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

  const onNewGame = () => {
    setGameKey(gameKey + 1);
  };

  return (
    <>
      <StatusBar />
      <div className="header">
        <h1>
          <a href="">Sort Them All!</a>
        </h1>
        <Menu />
      </div>
      <div style={{ flexGrow: 1 }}>
        {gameStarted && <MainGame
          key={gameKey}
          practice={practice}
          generation={generation}
          onNewGame={onNewGame} /> || (
          <div>
            <div
              style={{
                background: 'var(--white)',
                borderRadius: 10,
                padding: 10,
                margin: '20px 0',
              }}>
              <p>
              Drag the items of the list to sort them in <strong>ascending</strong> order according to the given criteria.
              You have 4 chances to guess the correct order.
              </p>
              <p>
              Keep in mind that some Pokémon species occur in <strong>multiple forms</strong> with different stats.
              Pay attention to their image when sorting them.
              </p>
              <p style={{ textAlign: 'center' }}>
                <button onClick={startGame} className='big plausible-event-name--play-game'>
                  Play Game #{gameNumber}
                </button>
              </p>
              <p>
              A new challenge is created each day at midnight UTC+0.
                <br />
              The next challenge begins in {timeRemaining}.
              </p>
            </div>
            <div
              style={{
                fontSize: '80%',
                background: 'var(--white)',
                borderRadius: 10,
                padding: 10,
                margin: '20px 0',
              }}>
              <div className="header" onClick={() => setPracticeOpen(!isPracticeOpen)}>
                <h1><strong>Practice</strong></h1>
                <div className="toggle">
                  {isPracticeOpen ? '‒' : '+'}
                </div>
              </div>
              <div className={`practicePanel ${isPracticeOpen ? 'open' : 'closed'}`}>
                <p>
                Practice with a random challenge.
                </p>
                <div>
                  <div>
                    <div className="buttonGroup" style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 400, margin: 'auto' }}>
                      <button onClick={startRandom} className='plausible-event-name--practice plausible-event-gen=all'>All Gens</button>
                      <hr style={{ flexBasis: '100%' }} />
                      {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'].map((numeral, i) => (
                        <button
                          key={i + 1}
                          onClick={startGen(i + 1)}
                          className={`plausible-event-name--practice plausible-event-gen=${i}`}
                        >
                          {numeral}
                        </button>
                      ))}
                    </div>
                    <p>
                    Note: while some stats have changed over the generations, the game always uses the latest stats regardless of the generation you choose to practice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer style={{ textAlign: 'center' }}>
        by <a href="https://github.com/lopis/sort-them-all">@lopis</a>
      </footer>
    </>
  );
}

export default App;
