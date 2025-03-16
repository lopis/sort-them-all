import { useState } from 'react';
import Modal from './Modal';
import ScoreTable from './ScoreTable';
import { gameNumber } from '../api/constants';

const ResultsModal = ({ scores, onClose }) => {
  const [closed, setClosed] = useState(false);
  const [copied, setCopied] = useState(false);

  const close = () => {
    setClosed(true);
  };

  const share = () => {
    const shareText = [
      `🌱Sort-Them-All #${gameNumber}`,
      '💦🔥',
      `Guesses: ${scores.length}`,
      scores.map((scoreRow) => scoreRow.map(value => (value ? '🔴' : '⚫️')).join('')).join('\n'),
      window.location.href,
    ];

    if (navigator.share) {
      navigator.share({
        title: `Sort-Them-All #${gameNumber}`,
        text: shareText.join('\n'),
      }).catch((error) => console.error('Error sharing', error));
    } else {
      navigator.clipboard.writeText(shareText.join('\n')).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      }).catch((error) => console.error('Error copying to clipboard', error));
    }
  };

  return (
    <Modal closed={closed} onClose={onClose}>
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
      <div className="buttonGroup" style={{ marginTop: 50 }}>
        <button onClick={share}>{copied ? 'Copied' : 'Share'}</button>
        <button onClick={close}>Close</button>
      </div>
    </Modal>
  );
};


export default ResultsModal;
