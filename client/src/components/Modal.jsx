import './Modal.css';
import { useCallback, useEffect, useState } from 'react';

const Modal = ({ closed, onClose, children }) => {
  const [closing, setClosing] = useState(closed);

  const closeModal = useCallback((closed) => {
    setClosing(closed);
    if (closed) {
      setTimeout(() => {
        onClose();
      }, 100);
    }
  }, [onClose]);

  useEffect(() => {
    closeModal(closed);
  }, [closed, onClose, closeModal]);

  return <div className={`modal ${closing ? 'closing' : ''}`}>
    <div className="overlay" onClick={closeModal}></div>
    <div className="body">
      { children }
    </div>
  </div>;
};

export default Modal;
