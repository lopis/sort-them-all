import './PokemonList.css'

function PokemonItem ({pokemon, onUp, onDown}) {
  const className = pokemon.movingUp ? 'moving-up'
    : pokemon.movingDown ? 'moving-down'
    : '';

  return (
    <div className={className} style={{
      display: "flex",
      alignItems: "center",
      border: "1px solid gray",
    }}>
      <img
        style={{ height: 64 }}
        src={pokemon.sprites.front_default}
        alt="pokemon sprite"
      />
      <div style={{flexGrow: 1}}>
        {pokemon.species.name}
      </div>
      <div className="up" onClick={onUp}></div>
      <div className="down" onClick={onDown}></div>
    </div>
  )
}

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
