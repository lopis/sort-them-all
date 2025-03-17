import { useState } from 'react';
import Modal from './Modal';
import './PokemonItem.css';
import './IntroModal.css';

const IntroModal = ({ criterion, onClose }) => {
  const [closed, setClosed] = useState(false);

  const close = () => {
    setClosed(true);
  };

  return (
    <Modal closed={closed} onClose={onClose}>
      <h2>
      Sort by: <strong>{criterion}</strong>
        <br />
        <div style={{ fontSize: '75%' }}>
          <span style={{ marginRight: -4 }}>in ascending order ⇃</span><span className="orderIcon"></span>
        </div>
      </h2>

      <div className='examples'>
        <div className="item example">
          <div className='sprite'>
            <img src={'body-head.png'} />
          </div>
          <div>Smolorb</div>
        </div>
        <div className="item example">
          <div className='sprite'>
            <img src={'body-legs.png'} />
          </div>
          <div>Median</div>
        </div>
        <div className="item example">
          <div className='sprite'>
            <img src={'body-bipedal.png'} />
          </div>
          <div>Bigboi</div>
        </div>
      </div>

      <div className="buttonGroup" style={{ marginTop: 50 }}>
        <button onClick={close}>Ok!</button>
      </div>
    </Modal>
  );
};


export default IntroModal;
