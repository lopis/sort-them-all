import ApiDataProvider from '../api/ApiDataProvider.jsx';
import Game from './Game.jsx';

const MainGame = (props) => (
  <ApiDataProvider {...props}>
    <Game practice={props.practice} onNewGame={props.onNewGame} />
  </ApiDataProvider>
);

export default MainGame;
