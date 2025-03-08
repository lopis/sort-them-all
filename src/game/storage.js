import { gameNumber } from '../api/constants';

const SAVE_KEY = 'sort-them-all-save';
const GAME_NUMBER_KEY = 'sort-them-all-date';

export const saveGame = (pokemonList, scores, gameDone, gameOver) => {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    pokemonList,
    scores,
    gameDone,
    gameOver,
  }));
  localStorage.setItem(GAME_NUMBER_KEY, gameNumber);
};

export const loadGame = () => {
  const saveNumber = parseInt(localStorage.getItem(GAME_NUMBER_KEY));
  if (saveNumber && saveNumber === gameNumber) {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) || null;
  }

  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(GAME_NUMBER_KEY);
  return null;
};
