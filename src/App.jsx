import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

// Import Templates
import Template1Menu from './restaurants/template1/Menu'; 
import Template2Menu from './restaurants/template2/Menu'; 
import Template3Menu from './restaurants/template3/Menu'; // <--- New Cafe Template

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />

        {/* Template 1: Modern & Playful */}
        <Route path="/template1" element={<Template1Menu />} />

        {/* Template 2: Luxury Fine Dining */}
        <Route path="/template2" element={<Template2Menu />} />

        {/* Template 3: Cozy Coffee House */}
        <Route path="/template3" element={<Template3Menu />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;