import { useState, useEffect } from 'react';
import { Pokedex } from 'pokeapi-js-wrapper';
import Prando from 'prando';
import ApiDataContext from './ApiDataContext';

const P = new Pokedex();
const TOTAL_POKEMON_COUNT = 1304;
export const OPTION_COUNT = 7;
const startingDate = new Date('2025/03/01');

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

const hyphenatedPokemonNames = [
  'Ho-oh',
  'Porygon-Z',
  'Jangmo-o',
  'Hakamo-o',
  'Kommo-o',
  'Wo-Chien',
  'Chien-Pao',
  'Ting-Lu',
  'Chi-Yu',
]

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const ApiDataProvider = ({ children }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState('');
  const [loading, setLoading] = useState(true);

  const daysSinceStart = Math.floor((new Date() - startingDate) / (1000 * 60 * 60 * 24));
  const [gameNumber] = useState(daysSinceStart);

  const fetchPokemon = async (rng) => {
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
        if (pokemon.name.includes('-') && !hyphenatedPokemonNames.some(name => pokemon.name.includes(name))) {
          pokemonData.label = pokemon.name.split('-')[1]; // TODO: is there always just one hyphen on can there be more?
        }
        return pokemonData;
      })
    );
    rng.reset();
    const criterion = rng.nextArrayItem(criteriaList);
    setPokemonList(shuffleArray(list));
    setSortingCriteria(criterion);
    setCorrectOrder([...list].sort((a, b) => a[criterion] - b[criterion]).map((pokemon) => pokemon[criterion]));
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const seed = new Date().toISOString().split('T')[0];
    const rng = new Prando(`game_date_${seed}`);
    fetchPokemon(rng);
  }, []);

  return (
    <ApiDataContext.Provider value={{ pokemonList, sortingCriteria, correctOrder, gameNumber, loading }}>
      {children}
    </ApiDataContext.Provider>
  );
};

export default ApiDataProvider;
