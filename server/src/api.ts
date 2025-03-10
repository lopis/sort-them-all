import Prando from 'prando';
import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex({
  hostName: 'hostname:3080',
});
import { OPTION_COUNT, TOTAL_POKEMON_COUNT } from './constants';

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

export const fetchFromAllPokemon = async (rng: Prando) => {
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
};

const fetchFromGeneration = () => {};

export const getPokemonList = async (rng, gen) => {
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
};
