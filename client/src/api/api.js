const host = 'https://p.jlopes.dev/sta';
const daily = `${host}/daily`;
const practice = (gen) => `${host}/practice/gen/${gen}`;
const health = `${host}/health`;

export const getHealth = async () => {
  const res = await fetch(health);
  if (!res.ok) {
    return false;
  }
  const body = await res.text();
  return res.status === 200 && body === 'ok';
};

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
