import PokemonItem from './PokemonItem'
import './PokemonList.css'

function PokemonList ({pokemonList = [], onUp, onDown}) {
  return (
    <div style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 3,
    }}>
      {pokemonList.map((pokemon, i) => (
        <PokemonItem key={i} pokemon={pokemon} onUp={() => onUp(i)} onDown={() => onDown(i)}/>
      ))}
    </div>
  );
}

export default PokemonList;
