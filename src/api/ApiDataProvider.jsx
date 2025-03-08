import { useState, useEffect, useCallback } from 'react';
import { Pokedex } from 'pokeapi-js-wrapper';
import Prando from 'prando';
import ApiDataContext from './ApiDataContext';
import { OPTION_COUNT, TOTAL_POKEMON_COUNT } from './constants';

const P = new Pokedex();
const criteriaList = [
  'height',
  'weight',
  'attack',
  'hp',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
];

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
];

const ApiDataProvider = ({ practice, generation, children }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFromAllPokemon = async (rng) => {
    const generatedIds = new Set();
    return Promise.all(
      Array.from({ length: OPTION_COUNT }, async () => {
        let pokemonId;
        do {
          pokemonId = rng.next(0, TOTAL_POKEMON_COUNT - 1);
        } while (generatedIds.has(pokemonId));
        const result = await P.getPokemonsList({ offset: pokemonId, limit: 1 });
        const pokemon = result.results[0];
        const pokemonData = await P.getPokemonByName(pokemon.name);
        pokemonData.stats.forEach(({ base_stat, stat }) => {
          pokemonData[stat.name] = base_stat;
        });
        pokemonData.isGmax = pokemon.name.endsWith('gmax');
        if (pokemon.name.includes('-') && !hyphenatedPokemonNames.some(name => pokemon.name.includes(name))) {
          pokemonData.label = pokemon.name.split('-').slice(1).join(' ');
        }
        return pokemonData;
      })
    );
  };

  const fetchFromGeneration = async (rng, gen) => {
    const generation = await P.getGenerationByName(gen);
    
    const species = generation.pokemon_species;
    const pokemonCount = species.length;
    const generatedIds = new Set();
    return Promise.all(
      Array.from({ length: OPTION_COUNT }, async () => {
        let pokemonId;
        do {
          pokemonId = rng.nextInt(0, pokemonCount - 1);
        } while (generatedIds.has(pokemonId));
        generatedIds.add(pokemonId);
        const pokemon = await P.getPokemonByName(species[pokemonId].name);
        const pokemonData = await P.getPokemonByName(pokemon.name);
        pokemonData.stats.forEach(({ base_stat, stat }) => {
          pokemonData[stat.name] = base_stat;
        });
        pokemonData.isGmax = pokemon.name.endsWith('gmax');
        if (pokemon.name.includes('-') && !hyphenatedPokemonNames.some(name => pokemon.name.includes(name))) {
          pokemonData.label = pokemon.name.split('-')[1]; // TODO: is there always just one hyphen on can there be more?
        }
        return pokemonData;
      })
    );
  };

  const getPokemonList = useCallback(async (rng, gen) => {
    rng.reset();
    let list;
    if (gen) {
      list = await fetchFromGeneration(rng, gen);
    } else {
      list = await fetchFromAllPokemon(rng);
    }
    
    rng.reset();
    const criterion = rng.nextArrayItem(criteriaList);
    setPokemonList(list);
    setSortingCriteria(criterion);
    setCorrectOrder([...list].sort((a, b) => a[criterion] - b[criterion]).map((pokemon) => pokemon[criterion]));
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);

    let rng;
    if (practice) {
      rng = new Prando();
    } else {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash |= 0; // Convert to 32bit integer
        }
        return hash;
      };    
      const seed = hashCode(now.toString());
      rng = new Prando(seed);
    }

    getPokemonList(rng, generation);
  }, [practice, generation, getPokemonList]);

  return (
    <ApiDataContext.Provider value={{ pokemonList, sortingCriteria, correctOrder, loading }}>
      {children}
    </ApiDataContext.Provider>
  );
};

export default ApiDataProvider;
