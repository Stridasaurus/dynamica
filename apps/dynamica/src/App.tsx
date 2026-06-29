import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudioPage from './pages/StudioPage';
import ToolsPage from './pages/ToolsPage';
import ToolPage from './pages/ToolPage';
import QuantVizPage from './pages/QuantVizPage';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] transition-colors">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/studios/:studioId" element={<StudioPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/:toolId" element={<ToolPage />} />
          <Route path="/quantviz" element={<QuantVizPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
