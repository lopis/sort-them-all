import { useEffect, useState } from 'react';
import { getHealth } from '../api/api';
import './StatusBar.css';

const StatusBar = () => {
  const [healthy, setHealthy] = useState(null);

  useEffect(() => {
    getHealth()
      .then((health) => {
        setHealthy(health);
      });
  }, []);

  if (healthy === false) {
    return (
      <div className='statusBar'>
        We&lsquo;re having some technical difficulties. Please try again later!
      </div>
    );
  }

  return null;
};

export default StatusBar;
