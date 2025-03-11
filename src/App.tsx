import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AppointmentsPage } from './pages/Appointments';

// Placeholder components - we'll create these next
const Services = () => <div>Services Page</div>;
const Staff = () => <div>Staff Page</div>;
const Clients = () => <div>Clients Page</div>;
const Settings = () => <div>Settings Page</div>;

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<AppointmentsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App; 