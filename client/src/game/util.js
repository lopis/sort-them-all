import Prando from 'prando';

export const shuffleArray = (array) => {
  let rng = new Prando();
  for (let i = array.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
