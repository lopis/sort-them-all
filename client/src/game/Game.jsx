import { useState, useContext, useEffect } from 'react';

import ApiDataContext from '../api/ApiDataContext';
import { OPTION_COUNT } from '../api/constants.js';
import Modal from '../components/Modal.jsx';
import PokemonList from '../components/PokemonList.jsx';
import './Game.css';
import { loadGame, saveGame } from './storage.js';
import { shuffleArray } from './util.js';
import Loading from '../components/Loading.jsx';

const MAX_TRIES = 4;

function Game({ practice, onNewGame }) {
  const { pokemonList, sortingCriteria, correctOrder, loading } = useContext(ApiDataContext);
  const [pokemons, setPokemonList] = useState([]);
  const [gameDone, setGameDone] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState([]);
  const [tries, setTries] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let save;
    if (!practice && (save = loadGame())) {
      setPokemonList(save.pokemonList);
      setScores(save.scores);
      setTries(save.scores.length);
      setGameDone(save.gameDone);
      setGameOver(save.gameOver);
    } else {
      setPokemonList(shuffleArray(pokemonList));
    }
  }, [pokemonList, practice]);

  const onListChange = (newList) => {
    setPokemonList(newList);
  };

  const submit = () => {
    setTries(tries+1);
    const newList = pokemons.map((pokemon, i) => ({
      ...pokemon,
      correct: correctOrder[i] === pokemon[sortingCriteria],
    }));
    setPokemonList(newList);
    const newScores = [
      ...scores,
      newList.map(p => p.correct)
    ];
    setScores(newScores);
    saveGame(newList, newScores, gameDone, gameOver);
  };

  const openModal = (time = 1000) => {
    setTimeout(() => setShowModal(true), time);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const correctCount = pokemons.reduce((previous, current) => {
    return previous + (current.correct ? 1 : 0);
  }, 0);

  if (!gameDone && correctCount === OPTION_COUNT) {
    setGameDone(true);
    openModal();
    setTries(tries-1);
  } else if (!gameOver && tries === MAX_TRIES) {
    setGameOver(true);
    const newList = pokemons.map((pokemon) => ({
      ...pokemon,
      incorrect: !pokemon.correct
    }));
    setPokemonList(newList);
  }

  if (loading) {
    return <Loading />;
  }
  
  return <div style={{ textAlign: 'center' }}>
    <h2>
      Sort by: <strong>{sortingCriteria.replace(/_-/, ' ').replace('hp', 'HP')}</strong>
      <br />
      <div style={{ fontSize: '75%' }}>
        <span style={{ marginRight: -4 }}>in ascending order ⇃</span><span className="orderIcon"></span>
      </div>
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
            {practice ? <button onClick={onNewGame}>New game</button> : <button onClick={openModal}>Results</button>}
          </>
          : gameOver ?
            <>
              <span className="message">😵 Game Over</span>
              {practice && <button onClick={onNewGame}>New game</button>}
            </>
            : <button onClick={submit}>Submit</button>
      }
    </div>
    <p>
      {correctCount} out of {OPTION_COUNT} in the correct position
    </p>
    {!practice && showModal && <Modal scores={scores} onClose={closeModal} />}
  </div>;
}

export default Game;
