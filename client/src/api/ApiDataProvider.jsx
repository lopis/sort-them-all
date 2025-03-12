import { useState, useEffect, useCallback } from 'react';
import ApiDataContext from './ApiDataContext';
import { fetchFromAllPokemon, fetchFromGeneration } from './api-fallback';
import { getDailyList, getPracticeList } from './api';

const ApiDataProvider = ({ practice, generation, children }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState('');
  const [loading, setLoading] = useState(true);

  const getPokemonList = useCallback(async () => {
    let list, criterion;
    try {
      if (practice) {
        ({ list, criterion } = await getPracticeList(generation));
      } else {
        ({ list, criterion } = await getDailyList());
      }
    } catch (error) {
      console.log(error);
      if (generation) {
        ({ list, criterion } = await fetchFromGeneration(generation));
      } else {
        ({ list, criterion } = await fetchFromAllPokemon(practice));
      }
    }
    
    setPokemonList(list);
    setSortingCriteria(criterion);
    setCorrectOrder([...list].sort((a, b) => a[criterion] - b[criterion]).map((pokemon) => pokemon[criterion]));
    setLoading(false);
  }, [practice, generation]);

  useEffect(() => {
    setLoading(true);
    getPokemonList();
  }, [practice, generation, getPokemonList]);

  return (
    <ApiDataContext.Provider value={{ pokemonList, sortingCriteria, correctOrder, loading }}>
      {children}
    </ApiDataContext.Provider>
  );
};

export default ApiDataProvider;
