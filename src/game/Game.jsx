import { useState } from 'react';

import PokemonList from './PokemonList.jsx'

function Game({pokemonList = []}) {
  const [pokemons, setPokemonList] = useState(pokemonList);
  const [tries, setTries] = useState(0);

  const moveUp = (i) => {
    if (i > 0) {
      const newList = [...pokemons];
      newList[i].movingUp = true;
      newList[i-1].movingDown = true;
      setPokemonList(newList);
      setTimeout(() => {
        const newList = [...pokemons];
        newList[i].movingUp = false;
        newList[i-1].movingDown = false;
        [newList[i-1], newList[i]] = [newList[i], newList[i-1]];
        setPokemonList(newList);
      }, 200)
    }
  }

  const moveDown = (i) => {
    if (i < pokemons.length - 1) {
      const newList = [...pokemons];
      newList[i].movingDown = true;
      newList[i+1].movingUp = true;
      setPokemonList(newList);
      setTimeout(() => {
        const newList = [...pokemons];
        newList[i].movingDown = false;
        newList[i+1].movingUp = false;
        [newList[i+1], newList[i]] = [newList[i], newList[i+1]];
        setPokemonList(newList);
      }, 200)
    }
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
    <PokemonList pokemonList={pokemons} onUp={moveUp} onDown={moveDown} />
    <p>
      <button onClick={submit}>Submit</button>
    </p>
    <p>
      Result: {correct} out of 6 correct
    </p>
    <p>
      Attempts: {tries}
    </p>
  </>
}

export default Game;
