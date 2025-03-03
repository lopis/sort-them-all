import { useContext } from 'react';
import ApiDataContext from '../api/ApiDataContext';
import './PokemonItem.css'

const valueFormatters = {
  height: (value) => `${value * 10} cm`,
  weight: (value) => `${value / 100} kg`,
}

const formatValue = (value, criterion) => {
  return valueFormatters[criterion] ? valueFormatters[criterion](value) : value
}

/**
 * Component to display a single Pokemon item with controls to move it up or down.
 *
 * @param {Object} props - The component props.
 * @param {Pokemon[]} props.pokemon - The pokemon object.
 * @param {Function} props.onUp - Callback function to move the pokemon up.
 * @param {Function} props.onDown - Callback function to move the pokemon down.
 */
function PokemonItem ({ item, dragHandleProps }) {
  const { sortingCriteria } = useContext(ApiDataContext);
  const pokemon = item;
  const correctClass = pokemon.correct
    ? 'correct' : 
    pokemon.incorrect ? 'incorrect' : ''

  return (
    <div {...dragHandleProps}
      className={[correctClass, 'item'].join(' ')}
    >
      <div className='sprite'>
        <img src={pokemon?.sprites?.front_default}
        />
      </div>
      <div style={{ flexBasis: 'calc(100% - 68px)' }}>
        <span style={{ textTransform: 'capitalize' }}>
          {pokemon?.species?.name || pokemon.name}
        </span>
        &nbsp;
        {(pokemon.correct || pokemon.incorrect) && (
          <span>
            ({formatValue(pokemon[sortingCriteria], sortingCriteria)})
          </span>
        )}
      </div>
      {(pokemon.correct || pokemon.incorrect) && pokemon.label && (
        <span className="label">{pokemon.label}</span>
      )}
    </div>
  )
}

export default PokemonItem;
