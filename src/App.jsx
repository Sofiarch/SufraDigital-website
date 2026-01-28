import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

// Import the New Template
import Template1Menu from './restaurants/template1/Menu'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />

        {/* The New Template Route */}
        <Route path="/template1" element={<Template1Menu />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;