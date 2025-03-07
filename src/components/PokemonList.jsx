import DraggableList from 'react-draggable-list';
import PokemonItem from '../components/PokemonItem';
import './PokemonList.css';

function PokemonList ({ pokemonList = [], onListChange }) {
  return (
    <DraggableList
      list={pokemonList}
      template={PokemonItem}
      springConfig={{ stiffness: 370, damping: 26 }}
      itemKey="name"
      onMoveEnd={onListChange}
      unsetZIndex
      constrainDrag
      lockedItems={pokemonList.filter(item => item.correct).map(item => item.name)}
    />
  );
}

export default PokemonList;
