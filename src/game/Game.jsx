import { useEffect, useRef, useState } from 'react';
import { Pokedex } from 'pokeapi-js-wrapper';
import Prando from 'prando';

const seed = new Date().toISOString().split('T')[0];
const rng = new Prando(seed);
const P = new Pokedex();
const TOTAL_POKEMON_COUNT = 1304;

function Game() {
  const [pokemonList, setPokemonList] = useState([]);
  const hasFetched = useRef(false);
  
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
          const result = await P.getPokemonSpeciesList({ offset: pokemonId, limit: 1 });
          const pokemon = result.results[0];
          const pokemonData = P.getPokemonSpeciesByName(pokemon.name);
          return pokemonData;
        })
      ));
    };
  
    fetchPokemon();
  }, []);

  console.log(pokemonList);
  
  return pokemonList.map(p => p.name).join(', ')
}

export default Game;
