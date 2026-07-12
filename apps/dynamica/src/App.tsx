import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudioPage from './pages/StudioPage';
import MapPage from './pages/MapPage';
import ToolPage from './pages/ToolPage';
import QuantVizPage from './pages/QuantVizPage';
import NlCrossCorrelogramPage from './models/nl-cross-correlogram/NlCrossCorrelogramPage';
import PhCoherogramPage from './models/ph-coherogram/PhCoherogramPage';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';

/** Reset scroll on route change. Without this, HashRouter keeps the old
 *  scroll position — footer links (clicked at the very bottom of a page)
 *  navigated correctly but left the viewport at the bottom of the new page,
 *  which read as "footer nav is broken" (PLAN.md R6). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] transition-colors">
      <ScrollToTop />
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/studios/signalviz" element={<Navigate to="/studios/physim" replace />} />
          <Route path="/studios/:studioId" element={<StudioPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/tools" element={<Navigate to="/map" replace />} />
          <Route path="/tools/:toolId" element={<ToolPage />} />
          <Route path="/quantviz" element={<QuantVizPage />} />
          <Route path="/models/nl-cross-correlogram" element={<NlCrossCorrelogramPage />} />
          <Route path="/models/ph-coherogram" element={<PhCoherogramPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
