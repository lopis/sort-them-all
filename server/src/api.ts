import Pokedex from 'pokedex-promise-v2';
import NodeCache from 'node-cache';
import { OPTION_COUNT, TOTAL_POKEMON_COUNT } from './constants';
import Prando from 'prando';

type Pokemon = {
  name: string;
  label: string;
  height: number;
  weight: number;
  attack: number;
  hp: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
};

const P = new Pokedex({
  // can be http as the requests are internal
  protocol: 'http',
  hostName: process.env.POKE_API_HOST || 'localhost:3080',
});

const cache = new NodeCache();

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

const getMidnightUTC = (): Date => {
  const now = new Date();
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDate = now.getUTCDate();
  return new Date(Date.UTC(utcYear, utcMonth, utcDate, 0, 0, 0));
};

const getDailySeed = (): number => {
  const now = getMidnightUTC();
  now.setHours(0, 0, 0, 0);
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };    
  return hashCode(now.toString());
};

export const fetchFromAllPokemon = async (seed: number) => {
  if (cache.has(seed)) {
    const cachedList = cache.get(seed) as Pokemon[];
    if (cachedList) {
      return {
        pokemonList: cachedList,
        seed,
        cached: true,
      };
    }
  }

  const rng = new Prando(seed);
  const generatedIds = new Set();
  const list = await Promise.all(
    Array.from({ length: OPTION_COUNT }, async () => {
      let pokemonId;
      do {
        pokemonId = rng.nextInt(0, TOTAL_POKEMON_COUNT - 1);
      } while (generatedIds.has(pokemonId));
      console.log('pokemonId', pokemonId);
      
      const result = await P.getPokemonsList({ offset: pokemonId, limit: 1 });
      const pokemon = result.results[0];
      const pokemonData = await P.getPokemonByName(pokemon.name);
      pokemonData.stats.forEach(({ base_stat, stat }) => {
        pokemonData[stat.name] = base_stat;
      });
      if (pokemon.name.includes('-') && !hyphenatedPokemonNames.some(name => pokemon.name.includes(name))) {
        pokemonData.label = pokemon.name.split('-').slice(1).join(' ');
      }

      return {
        name: pokemon.name,
        label: pokemon.label,
        height: pokemonData.height,
        weight: pokemonData.weight,
        attack: pokemonData.attack,
        hp: pokemonData.hp,
        defense: pokemonData.defense,
        'special-attack': pokemonData['special-attack'],
        'special-defense': pokemonData['special-defense'],
        speed: pokemonData.speed,
      };
    })
  );
  cache.set(seed, list);
  return {
    pokemonList: list,
    seed,
    cached: false,
  };
};

const fetchFromGeneration = async (seed: number, gen: number) => {
  const rng = new Prando(seed);
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
      return {
        name: pokemon.name,
        label: pokemon.label,
        height: pokemonData.height,
        weight: pokemonData.weight,
        attack: pokemonData.attack,
        hp: pokemonData.hp,
        defense: pokemonData.defense,
        'special-attack': pokemonData['special-attack'],
        'special-defense': pokemonData['special-defense'],
        speed: pokemonData.speed,
      };
    })
  );

  return {
    pokemonList: list,
    seed,
    cached: false,
  };
};

export const getDailyList = async () => {
  try {
    return await fetchFromAllPokemon(getDailySeed());
  } catch (error) {
    console.error(error);
    return error as Error;
  }
};

export const getPracticeList = async (gen?: number) => {
  const seed = process.hrtime()[1];
  try {
    if (gen) {
      return await fetchFromGeneration(seed, gen);
    } else {
      return await fetchFromAllPokemon(seed);
    }
  } catch (error) {
    console.error(error);
    return error as Error;
  }
};
