import { useEffect, useState } from 'react';
import PreferencesContext from './PreferencesContext';
import { loadPreferences } from '../game/storage';

const PreferencesProvider = ({ children }) => {
  const savedPreference = loadPreferences();
  const [animated, setAnimated] = useState(savedPreference.animated);

  useEffect(() => {
    const handlePreferencesChange = () => {
      const savedPreference = loadPreferences();
      setAnimated(savedPreference.animated);
    };

    addEventListener('preferences', handlePreferencesChange);

    return () => {
      removeEventListener('preferences', handlePreferencesChange);
    };
  }, []);

  return (
    <PreferencesContext.Provider value={{ animated }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesProvider;
