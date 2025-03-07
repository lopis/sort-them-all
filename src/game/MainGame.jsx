import ApiDataProvider from '../api/ApiDataProvider.jsx';
import Game from './Game.jsx';

const MainGame = () => (
  <ApiDataProvider>
    <Game />
  </ApiDataProvider>
);

export default MainGame;
