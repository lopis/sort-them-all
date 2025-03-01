import { useEffect, useRef, useState } from 'react';
import { Pokedex } from 'pokeapi-js-wrapper';
import Prando from 'prando';

import PokemonList from './PokemonList.jsx'

const seed = new Date().toISOString().split('T')[0];
const rng = new Prando(seed);
const P = new Pokedex();
const TOTAL_POKEMON_COUNT = 1304;

function Game() {
  const [pokemonList, setPokemonList] = useState([]);
  const hasFetched = useRef(false);

  const moveUp = (i) => {
    console.log('moveUp');
    
    if (i > 0) {
      const newList = [...pokemonList];
      newList[i].movingUp = true;
      newList[i-1].movingDown = true;
      setPokemonList(newList);
      setTimeout(() => {
        const newList = [...pokemonList];
        newList[i].movingUp = false;
        newList[i-1].movingDown = false;
        [newList[i-1], newList[i]] = [newList[i], newList[i-1]];
        setPokemonList(newList);
      }, 100)
    }
  }

  const moveDown = (i) => {
    if (i < pokemonList.length - 1) {
      const newList = [...pokemonList];
      newList[i].movingDown = true;
      newList[i+1].movingUp = true;
      setPokemonList(newList);
      setTimeout(() => {
        const newList = [...pokemonList];
        newList[i].movingDown = false;
        newList[i+1].movingUp = false;
        [newList[i+1], newList[i]] = [newList[i], newList[i+1]];
        setPokemonList(newList);
      }, 100)
    }
  }

  
  useEffect(() => {
    if(!hasFetched.current) {
      hasFetched.current = true;
    } else {
      return;
    }

    const fetchPokemon = async () => {
      setPokemonList(await Promise.all(
        Array.from({length: 6}, async () => {
          const pokemonId = rng.next(0, TOTAL_POKEMON_COUNT - 1);
          const result = await P.getPokemonsList({ offset: pokemonId, limit: 1 });
          const pokemon = result.results[0];
          const pokemonData = P.getPokemonByName(pokemon.name);
          return pokemonData;
        })
      ));
    };
  
    fetchPokemon();
  }, []);
  
  return <>
    <p>
      Sort by: <strong>height</strong>
    </p>
    <PokemonList pokemonList={pokemonList} onUp={moveUp} onDown={moveDown} />
    <p>
      <button>Submit</button>
    </p>
  </>
}

export default Game;
