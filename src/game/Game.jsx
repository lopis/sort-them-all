import { useState } from 'react';

import PokemonList from './PokemonList.jsx'
import { OPTION_COUNT } from '../api/ApiDataProvider.jsx';

const MAX_TRIES = 4

function Game({pokemonList = []}) {
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
      correct: i === pokemon.order,
    })));
  }
  


  const correct = pokemons.reduce((previous, current) => {
    return previous + (current.correct ? 1 : 0);
  }, 0)

  if (!gameDone && correct === OPTION_COUNT) {
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
    <p>
      Sort by: <strong>height</strong>
    </p>
    <PokemonList pokemonList={pokemons} onListChange={onListChange} />
    <p>
      {
        gameDone ? 
        <span>🎉 Great!</span>
        : gameOver ?
        <span>😵 Game Over</span>
        : <button onClick={submit}>Submit</button>}
    </p>
    <div>
      <div>
        {correct} out of {OPTION_COUNT} correct
      </div>
      <div>
        Attempt {tries + 1} of {MAX_TRIES}
      </div>
    </div>
  </>
}

export default Game;
