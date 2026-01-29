import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

// Import Templates
import Template1Menu from './restaurants/template1/Menu'; 
import Template2Menu from './restaurants/template2/Menu'; // <--- Import the new one

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />

        {/* Existing Template */}
        <Route path="/template1" element={<Template1Menu />} />

        {/* New Luxury Template */}
        <Route path="/template2" element={<Template2Menu />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;