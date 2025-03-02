// ApiDataProvider.jsx
import React, { createContext, useState, useEffect } from 'react';
import { Pokedex } from 'pokeapi-js-wrapper';
import Prando from 'prando';

const P = new Pokedex();
const TOTAL_POKEMON_COUNT = 1304;
const seed = new Date().toISOString().split('T')[0];
const rng = new Prando(seed);

export const ApiDataContext = createContext();

export const ApiDataProvider = ({ children }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      /**
       * @type Pokemon[]
       */
      const list = await Promise.all(
        Array.from({length: 6}, async () => {
          const pokemonId = rng.next(0, TOTAL_POKEMON_COUNT - 1);
          const result = await P.getPokemonsList({ offset: pokemonId, limit: 1 });
          const pokemon = result.results[0];
          const pokemonData = P.getPokemonByName(pokemon.name);
          return pokemonData;
        })
      );
      [...list].sort((a, b) => a.height - b.height).forEach((pokemon, i) => {pokemon.order = i});
      setPokemonList(list);
      setLoading(false);
    };
  
    setLoading(true);
    fetchPokemon();
  }, []);

  return (
    <ApiDataContext.Provider value={{ pokemonList, loading }}>
      {children}
    </ApiDataContext.Provider>
  );
};
