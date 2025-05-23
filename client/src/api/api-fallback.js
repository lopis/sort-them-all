import { Pokedex } from 'pokeapi-js-wrapper';
import { OPTION_COUNT, TOTAL_POKEMON_COUNT } from './constants';
import Prando from 'prando';
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

const getMidnightUTC = () => {
  const now = new Date();
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDate = now.getUTCDate();
  return new Date(Date.UTC(utcYear, utcMonth, utcDate, 0, 0, 0));
};

const getCriterion = (rng) => {
  return rng.nextArrayItem(criteriaList);
};

export const fetchFromAllPokemon = async (practice) => {
  const rng = getRng(practice);
  const generatedIds = new Set();
  const list = await Promise.all(
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

  return {
    list,
    criterion: getCriterion(rng),
  };
};

export const fetchFromGeneration = async (gen) => {
  const rng = getRng(true);
  const generation = await P.getGenerationByName(gen);
  
  const species = generation.pokemon_species;
  const pokemonCount = species.length;
  const generatedIds = new Set();
  const list = await Promise.all(
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

  return {
    list,
    criterion: getCriterion(rng),
  };
};

export const getRng = (practice) => {
  let rng;
  if (practice) {
    rng = new Prando();
  } else {
    const now = getMidnightUTC();
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

  return rng;
};
