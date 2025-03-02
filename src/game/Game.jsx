import { useState } from 'react';

import PokemonList from './PokemonList.jsx'
import { OPTION_COUNT } from '../api/ApiDataProvider.jsx';

function Game({pokemonList = []}) {
  const [pokemons, setPokemonList] = useState(pokemonList);
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
  
  return <>
    <p>
      Sort by: <strong>height</strong>
    </p>
    <PokemonList pokemonList={pokemons} onListChange={onListChange} />
    <p>
      <button onClick={submit}>Submit</button>
    </p>
    <div>
      <div>
        Result: {correct} out of {OPTION_COUNT} correct
      </div>
      <div>
        Attempts: {tries}
      </div>
    </div>
  </>
}

export default Game;
