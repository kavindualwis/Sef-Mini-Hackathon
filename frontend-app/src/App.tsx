import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Verify from './pages/Verify/Verify';
import Home from './pages/Home/Home';
import Seller from './pages/Seller/Seller';

const App = () => {
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing authModal={authModal} setAuthModal={setAuthModal} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
