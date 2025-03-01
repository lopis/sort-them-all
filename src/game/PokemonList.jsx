import './PokemonList.css'

/**
 * Component to display a single Pokemon item with controls to move it up or down.
 *
 * @param {Object} props - The component props.
 * @param {Pokemon[]} props.pokemon - The pokemon object.
 * @param {Function} props.onUp - Callback function to move the pokemon up.
 * @param {Function} props.onDown - Callback function to move the pokemon down.
 */
function PokemonItem ({pokemon, onUp, onDown}) {
  const movingClass = pokemon.movingUp ? 'moving-up'
    : pokemon.movingDown ? 'moving-down'
    : '';

  const correctClass = pokemon.correct ? 'correct' : ''

  return (
    <div className={[movingClass, correctClass].join(' ')} style={{
      display: "flex",
      alignItems: "center",
      background: "#ccd0d7",
      borderRadius: 99,
    }}>
      <img
        style={{
          height: 64,
          width: 64,
          borderRadius: 99,
          margin: 5,
          background: "white",
        }}
        src={pokemon.sprites.front_default}
      />
      <div style={{flexGrow: 1}}>
        <span style={{textTransform: "capitalize"}}>
          {pokemon.species.name}
        </span>
        &nbsp;
        {pokemon.correct && <span>
          ({pokemon.height * 10} cm)
        </span>}
      </div>
      <div style={{marginRight: 10}}>
        <div className="up" onClick={onUp}></div>
        <div className="down" onClick={onDown}></div>
      </div>
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
