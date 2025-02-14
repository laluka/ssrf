import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StreamBrowser } from './pages/StreamBrowser';
import { Guidelines } from './pages/Guidelines';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/search" element={<StreamBrowser />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/" element={<Navigate to="/search" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
