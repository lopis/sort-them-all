import { useContext, useEffect, useRef, useState } from 'react';
import './Menu.css';
import { savePreference } from '../game/storage';
import PreferencesContext from '../preferences/PreferencesContext';

const Menu = () => {
  const { animated } = useContext(PreferencesContext);
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, isOpen]);

  const onChangeAnimated = (event) => {
    savePreference('animated', event.target.checked);
  };

  return (
    <div
      ref={ref} 
      style={{ position: 'relative' }}
      className={isOpen ? 'open' : 'closed'}>
      <span alt="settings" className='settings' onClick={() => setOpen(!isOpen)}>≡</span>
      <div className="dropdown">
        <label className="field" htmlFor="animated">
          <span>Animated</span>
          <input type="checkbox" name="animated" id="animated" checked={animated} onChange={onChangeAnimated} />
          <div className="switch"></div>
        </label>
      </div>
    </div>
  );
};

export default Menu;
