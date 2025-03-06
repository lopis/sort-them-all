import { useState, useContext } from 'react';

import ApiDataContext from '../api/ApiDataContext';
import PokemonList from './PokemonList.jsx'
import { OPTION_COUNT } from '../api/ApiDataProvider.jsx';
import './Game.css';
import ScoreTable from './ScoreTable.jsx';
import Modal from './Modal.jsx';

const MAX_TRIES = 4

function Game() {
  const { pokemonList, sortingCriteria, correctOrder, gameNumber } = useContext(ApiDataContext);
  const [pokemons, setPokemonList] = useState(pokemonList);
  const [gameDone, setGameDone] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState([]);
  const [tries, setTries] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const onListChange = (newList) => {
    setPokemonList(newList);
  }

  const submit = () => {
    setTries(tries+1);
    const newList = pokemons.map((pokemon, i) => ({
      ...pokemon,
      correct: correctOrder[i] === pokemon[sortingCriteria],
    }))
    setPokemonList(newList);
    setScores([
      ...scores,
      newList.map(p => p.correct)
    ])
  }

  const openModal = (time = 1000) => {
    setTimeout(() => setShowModal(true), time);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const correctCount = pokemons.reduce((previous, current) => {
    return previous + (current.correct ? 1 : 0);
  }, 0)

  if (!gameDone && correctCount === OPTION_COUNT) {
    setGameDone(true);
    openModal();
    setTries(tries-1);
  } else if (!gameOver && tries === MAX_TRIES) {
    setGameOver(true);
    openModal();
    setPokemonList(pokemons.map((pokemon) => ({
      ...pokemon,
      incorrect: !pokemon.correct
    })));
  }
  
  return <>
    <h2>
      Sort by: <strong>{sortingCriteria.replace(/_-/, ' ').replace('hp', 'HP')}</strong>
    </h2>
    <div style={{ pointerEvents: gameDone || gameOver ? 'none' : 'initial' }}>
      <PokemonList pokemonList={pokemons} onListChange={onListChange} />
    </div>
    <div>
      {Array.from({ length: MAX_TRIES }).map((_, i) => (
        <div key={i} className={`pokeball ${i > (MAX_TRIES - tries - 1) ? 'fainted' : ''}`}></div>
      ))}
    </div>
    <div>
      {
        gameDone ? 
          <>
            <span className="message">
              {scores.length === 1 ? '🎆 Perfect!' : '🎉 Great!'}
            </span>
            <button onClick={openModal}>Results</button>
          </>
          : gameOver ?
            <span className="message">😵 Game Over</span>
            : <button onClick={submit}>Submit</button>
      }
    </div>
    <p>
      {correctCount} out of {OPTION_COUNT} in the correct position
    </p>
    {showModal && <Modal scores={scores} gameNumber={gameNumber} onClose={closeModal} />}
  </>
}

export default Game;
