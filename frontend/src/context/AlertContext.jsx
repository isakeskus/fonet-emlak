import { createContext, useCallback, useContext, useRef, useState } from 'react';

const AlertContext = createContext(null);

// Uygulamanın her yerinden showAlert(...) çağrılabilsin diye context kullanılır.
export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const zamanlayici = useRef(null);

  const showAlert = useCallback((mesaj, tur = 'success') => {
    clearTimeout(zamanlayici.current);
    setAlert({ mesaj, tur });
    zamanlayici.current = setTimeout(() => setAlert(null), 4000);
  }, []);

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      {alert && (
        <div
          className={`alert alert-${alert.tur} alert-dismissible show position-fixed top-0 end-0 m-3`}
          style={{ zIndex: 9999 }}
        >
          {alert.mesaj}
          <button type="button" className="btn-close" onClick={() => setAlert(null)} />
        </div>
      )}
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
