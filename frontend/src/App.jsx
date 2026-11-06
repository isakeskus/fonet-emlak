import { useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import IsyeriPage from './pages/IsyeriPage.jsx';
import MusteriPage from './pages/MusteriPage.jsx';
import EmlakPage from './pages/EmlakPage.jsx';
import AramaPage from './pages/AramaPage.jsx';

const MENU = [
  { yol: '/', ad: 'Dashboard' },
  { yol: '/isyeri', ad: 'İşyeri Tanımı' },
  { yol: '/musteri', ad: 'Müşteri Tanımı' },
  { yol: '/emlak', ad: 'Emlak Tanımı' },
  { yol: '/arama', ad: 'Emlak Arama' },
];

export default function App() {
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <i className="fas fa-home me-2" />
            Fonet Emlak
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuAcik((a) => !a)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${menuAcik ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto">
              {MENU.map((m) => (
                <li className="nav-item" key={m.yol}>
                  <NavLink
                    to={m.yol}
                    end={m.yol === '/'}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuAcik(false)}
                  >
                    {m.ad}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4 mb-5">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/isyeri" element={<IsyeriPage />} />
          <Route path="/musteri" element={<MusteriPage />} />
          <Route path="/emlak" element={<EmlakPage />} />
          <Route path="/arama" element={<AramaPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
