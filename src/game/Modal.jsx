import ScoreTable from './ScoreTable';
import './Modal.css';
import { useState } from 'react';
import { OPTION_COUNT } from '../api/ApiDataProvider';

const Modal = ({ scores, gameNumber, onClose }) => {
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      onClose()
    }, 100);
  }

  const share = () => {
    const shareText = [
      `Sort-Them-All #${gameNumber}`,
      window.location.hostname,
      `🌱💦🔥 | Guesses: ${scores.length}`,
      ...Array.from({ length: OPTION_COUNT }).map((_, colIndex) => (
        scores.map((scoreRow, rowIndex) => (
          <span key={rowIndex}>{scoreRow[colIndex] ? '🔴' : '⚫️'}</span>
        ))
      ))
    ]

    if (navigator.share) {
      navigator.share({
        title: `Sort-Them-All #${gameNumber}`,
        text: shareText.join('\n'),
        url: window.location.href,
      }).catch((error) => console.error('Error sharing', error));
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  }

  return <div class={`modal ${closing ? 'closing' : ''}`}>
    <div className="overlay"></div>
    <div className="body">
      <h3>
        Sort-Them-All #{gameNumber}
      </h3>
      <p>
      🌱💦🔥
      </p>
      <p>
        You guessed the correct
        <br />
        order in {scores.length == 1 ? 'a single guess' : `${scores.length} guesses`}!
      </p>
      <ScoreTable scores={scores} />
      <div class="buttonGroup">
        <button onClick={share}>Share</button>
        <button onClick={close}>Close</button>
      </div>
    </div>
  </div>
}

export default Modal;
