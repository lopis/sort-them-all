const host = 'https://p.jlopes.dev/sta';
const daily = `${host}/daily`;
const practice = (gen) => `${host}/practice/gen/${gen}`;

export const getDailyList = async () => {
  const res = await fetch(daily);
  const json = await res.json();
  return {
    list: json.pokemonList,
    criterion: json.criterion,
  };
};

export const getPracticeList = async (gen) => {
  const res = await fetch(practice(gen || 'all'));
  const json = await res.json();
  
  return {
    list: json.pokemonList,
    criterion: json.criterion,
  };
};
