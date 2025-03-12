import Pokedex, { Pokemon, PokemonSpecies } from 'pokedex-promise-v2';
import NodeCache from 'node-cache';
import { OPTION_COUNT, TOTAL_POKEMON_COUNT } from './constants';
import Prando from 'prando';

type Result = {
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
  sprites: Sprites;
};

type Sprites = {
  still: string[],
  showdown: string[],
}

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
  'Walking-Wake',
  'Iron-Boulder',
  'Slither-Wing',
  'Iron-Crown',
  'Sandy-Shocks',
];

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


const filterSprites = (sprites: Pokedex.PokemonSprites): Sprites => {
  const still = [];
  const showdown = [];
  
  if (sprites.front_default) {
    still.push(sprites.front_default);
  }
  if (sprites.front_shiny	) {
    still.push(sprites.front_shiny);
  }
  if (sprites.front_female	) {
    still.push(sprites.front_female);
  }

  if (sprites.other.showdown.front_default) {
    showdown.push(sprites.other.showdown.front_default);
  }
  if (sprites.other.showdown.front_shiny	) {
    showdown.push(sprites.other.showdown.front_shiny);
  }
  if (sprites.other.showdown.front_female	) {
    showdown.push(sprites.other.showdown.front_female);
  }

  return { still, showdown };
};

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

const getCriterion = (rng: Prando) => {
  return rng.nextArrayItem(criteriaList);
};

export const fetchFromAllPokemon = async (seed: number) => {
  if (cache.has(seed)) {
    const cachedResponse = cache.get(seed) as Result[];
    if (cachedResponse) {
      return {
        ...cachedResponse,
        cached: true,
      };
    }
  }

  const rng = new Prando(seed);
  const generatedIds = new Set();
  const list = await Promise.all(
    Array.from({ length: OPTION_COUNT }, async () => {
      let pokemonId: number;
      let pokemonData: Pokemon;
      let sprites: Sprites;
      let tries = 0;
      do {
        do {
          pokemonId = rng.nextInt(0, TOTAL_POKEMON_COUNT - 1);
        } while (generatedIds.has(pokemonId));
  
        const result = await P.getPokemonsList({ offset: pokemonId, limit: 1 });
        const pokemon = result.results[0];
        pokemonData = await P.getPokemonByName(pokemon.name);
        pokemonData.stats.forEach(({ base_stat, stat }) => {
          pokemonData[stat.name] = base_stat;
        });
        if (pokemon.name.includes('-') && !hyphenatedPokemonNames.some(name => pokemon.name.includes(name))) {
          pokemonData.label = pokemon.name.split('-').slice(1).join(' ');
        }
        sprites = filterSprites(pokemonData.sprites);
      } while (tries++ < 10 && sprites.still.length < 1);

      return {
        name: pokemonData.species.name,
        label: pokemonData.label,
        height: pokemonData.height,
        weight: pokemonData.weight,
        attack: pokemonData.attack,
        hp: pokemonData.hp,
        defense: pokemonData.defense,
        'special-attack': pokemonData['special-attack'],
        'special-defense': pokemonData['special-defense'],
        speed: pokemonData.speed,
        sprites,
      };
    })
  );

  const result = {
    pokemonList: list,
    criterion: getCriterion(rng),
    seed,
  };
  cache.set(seed, result);
  return result;
};

const fetchFromGeneration = async (seed: number, gen: number) => {
  const rng = new Prando(seed);
  const generation = await P.getGenerationByName(gen);

  const genSpecies = generation.pokemon_species;
  const pokemonCount = genSpecies.length;
  const generatedIds = new Set();
  const list = await Promise.all(
    Array.from({ length: OPTION_COUNT }, async () => {
      let pokemonId;let pokemonSpecies:PokemonSpecies;
      let pokemonData: Pokemon;
      let sprites: Sprites;
      let tries = 0;

      do {
        do {
          pokemonId = rng.nextInt(0, pokemonCount - 1);
        } while (generatedIds.has(pokemonId));
        generatedIds.add(pokemonId);
      
        pokemonSpecies = await P.getPokemonSpeciesByName(genSpecies[pokemonId].name);
        const varietyName: string = pokemonSpecies?.varieties.length > 0 ?
          rng.nextArrayItem(pokemonSpecies.varieties).pokemon.name :
          pokemonSpecies.name;
        pokemonData = await P.getPokemonByName(varietyName);
        pokemonData.stats.forEach(({ base_stat, stat }) => {
          pokemonData[stat.name] = base_stat;
        });
        pokemonData.isGmax = pokemonData.name.endsWith('gmax');
        pokemonData.label = pokemonData.name.replace(pokemonSpecies.name, '').replace(/-/g, ' ').trim();
        sprites = filterSprites(pokemonData.sprites);
        console.log('sprites', pokemonData.name, sprites.still.length);
      } while (tries++ < 10 && sprites.still.length < 1);

      return {
        name: pokemonSpecies.name,
        label: pokemonData.label || null,
        height: pokemonData.height,
        weight: pokemonData.weight,
        attack: pokemonData.attack,
        hp: pokemonData.hp,
        defense: pokemonData.defense,
        'special-attack': pokemonData['special-attack'],
        'special-defense': pokemonData['special-defense'],
        speed: pokemonData.speed,
        sprites,
      };
    })
  );

  return {
    pokemonList: list,
    criterion: getCriterion(rng),
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

