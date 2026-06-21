import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuantVizPage from './pages/QuantVizPage';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quantviz" element={<QuantVizPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
