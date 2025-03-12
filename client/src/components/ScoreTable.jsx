import { OPTION_COUNT } from '../api/constants';

const ScoreTable = ({ scores }) => {
  return (
    <div className="scoreTable">
      {scores.length > 0 && (
        Array.from({ length: OPTION_COUNT }).map((_, colIndex) => (
          <div key={colIndex}>
            {scores.map((scoreRow, rowIndex) => (
              <span key={rowIndex}>{scoreRow[colIndex] ? '🔴' : '⚫️'}</span>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ScoreTable;
