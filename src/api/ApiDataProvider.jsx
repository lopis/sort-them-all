import { useState, useEffect } from 'react';
import { Pokedex } from 'pokeapi-js-wrapper';
import Prando from 'prando';
import ApiDataContext from './ApiDataContext';

const P = new Pokedex();
const TOTAL_POKEMON_COUNT = 1304;
export const OPTION_COUNT = 7;
const seed = new Date().toISOString().split('T')[0];
const rng = new Prando(`game_date_${seed}`);

const ApiDataProvider = ({ children }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      /**
       * @type Pokemon[]
       */
      rng.reset();
      const list = await Promise.all(
        Array.from({length: OPTION_COUNT}, async () => {
          const pokemonId = rng.next(0, TOTAL_POKEMON_COUNT - 1);
          const result = await P.getPokemonsList({ offset: pokemonId, limit: 1 });
          const pokemon = result.results[0];
          const pokemonData = P.getPokemonByName(pokemon.name);
          return pokemonData;
        })
      );
      setCorrectOrder([...list].sort((a, b) => a.height - b.height).map((pokemon) => pokemon.height));
      setPokemonList(list);
      setLoading(false);
    };
  
    setLoading(true);
    fetchPokemon();
  }, []);

  return (
    <ApiDataContext.Provider value={{ pokemonList, correctOrder, loading }}>
      {children}
    </ApiDataContext.Provider>
  );
};

export default ApiDataProvider;
