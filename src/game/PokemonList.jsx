import DraggableList from 'react-draggable-list';
import PokemonItem from './PokemonItem'
import './PokemonList.css'

function PokemonList ({pokemonList = [], onListChange}) {
  return (
    <DraggableList
      list={pokemonList}
      template={PokemonItem}
      springConfig={{stiffness: 370, damping: 26}}
      itemKey="name"
      onMoveEnd={onListChange}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    />
  );
}

export default PokemonList;
