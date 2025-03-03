import { useState, useEffect } from 'react';
import { Pokedex } from 'pokeapi-js-wrapper';
import Prando from 'prando';
import ApiDataContext from './ApiDataContext';

const P = new Pokedex();
const TOTAL_POKEMON_COUNT = 1304;
export const OPTION_COUNT = 7;
const seed = new Date().toISOString().split('T')[0];
const rng = new Prando(`game_date_${seed}`);

const criteriaList = [
  'height',
  'weight',
  'attack',
  'hp',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
]

const ApiDataProvider = ({ children }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState('');
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      rng.reset();
      const list = await Promise.all(
        Array.from({ length: OPTION_COUNT }, async () => {
          const pokemonId = rng.next(0, TOTAL_POKEMON_COUNT - 1);
          const result = await P.getPokemonsList({ offset: pokemonId, limit: 1 });
          const pokemon = result.results[0];
          const pokemonData = await P.getPokemonByName(pokemon.name);
          pokemonData.stats.forEach(({ base_stat, stat }) => {
            pokemonData[stat.name] = base_stat
          });
          pokemonData.isGmax = pokemon.name.endsWith('gmax');
          return pokemonData;
        })
      );
      rng.reset();
      const criterion = rng.nextArrayItem(criteriaList);
      setPokemonList(list);
      setSortingCriteria(criterion);
      setCorrectOrder([...list].sort((a, b) => a[criterion] - b[criterion]).map((pokemon) => pokemon[criterion]));
      setLoading(false);
    };
  
    setLoading(true);
    fetchPokemon();
  }, []);

  return (
    <ApiDataContext.Provider value={{ pokemonList, sortingCriteria, correctOrder, loading }}>
      {children}
    </ApiDataContext.Provider>
  );
};

export default ApiDataProvider;
