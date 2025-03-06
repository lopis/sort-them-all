import ScoreTable from './ScoreTable';
import './Modal.css';
import { useState } from 'react';

const Modal = ({ scores, gameNumber, onClose }) => {
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      onClose()
    }, 100);
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
        <button>Share</button>
        <button onClick={close}>Close</button>
      </div>
    </div>
  </div>
}

export default Modal;
