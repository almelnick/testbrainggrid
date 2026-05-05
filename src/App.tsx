import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Agentes from './pages/Agentes';
import BriefGenerator from './pages/BriefGenerator';
import CampanaCreator from './pages/CampanaCreator';
import AgentChat from './pages/AgentChat';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agentes" element={<Agentes />} />
        <Route path="/brief" element={<BriefGenerator />} />
        <Route path="/campana" element={<CampanaCreator />} />
        <Route path="/chat/:agentId" element={<AgentChat />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
