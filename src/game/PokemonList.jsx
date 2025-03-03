import DraggableList from 'react-draggable-list';
import PokemonItem from './PokemonItem'
import './PokemonList.css'

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
    />
  );
}

export default PokemonList;
