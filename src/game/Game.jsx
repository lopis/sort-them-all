import { useState, useContext } from 'react';

import ApiDataContext from '../api/ApiDataContext';
import PokemonList from './PokemonList.jsx'
import { OPTION_COUNT } from '../api/ApiDataProvider.jsx';
import './Game.css';

const MAX_TRIES = 4

function Game() {
  const { pokemonList, sortingCriteria, correctOrder } = useContext(ApiDataContext);
  const [pokemons, setPokemonList] = useState(pokemonList);
  const [gameDone, setGameDone] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [tries, setTries] = useState(0);

  const onListChange = (newList) => {
    setPokemonList(newList);
  }

  const submit = () => {
    setTries(tries+1);
    setPokemonList(pokemons.map((pokemon, i) => ({
      ...pokemon,
      correct: correctOrder[i] === pokemon[sortingCriteria],
    })));
  }
  


  const correctCount = pokemons.reduce((previous, current) => {
    return previous + (current.correct ? 1 : 0);
  }, 0)

  if (!gameDone && correctCount === OPTION_COUNT) {
    setGameDone(true);
    setTries(tries-1);
  } else if (!gameOver && tries === MAX_TRIES) {
    setGameOver(true)
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
    <p>
      {
        gameDone ? 
          <span class="message">🎉 Great!</span>
          : gameOver ?
            <span class="message">😵 Game Over</span>
            : <button onClick={submit}>Submit</button>
      }
    </p>
    <div>
      <div>
        {correctCount} out of {OPTION_COUNT} in the correct position
      </div>
      <div>
        {Array.from({ length: MAX_TRIES }).map((_, i) => (
          <div key={i} className={`pokeball ${i > (MAX_TRIES - tries - 1) ? 'fainted' : ''}`}></div>
        ))}
      </div>
    </div>
  </>
}

export default Game;
