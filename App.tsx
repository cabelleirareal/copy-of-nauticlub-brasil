
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Sell from './pages/Sell';
import Inspection from './pages/Inspection';
import Shipyards from './pages/Shipyards';
import Brands from './pages/Brands';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';
import WhatsAppButton from './components/WhatsAppButton';
import LeadModal from './components/LeadModal';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedBoatId, setSelectedBoatId] = useState<string | undefined>(undefined);

  const openLeadModal = (boatId?: string) => {
    setSelectedBoatId(boatId);
    setIsLeadModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-16">
        {React.cloneElement(children as React.ReactElement, { onOpenLead: openLeadModal })}
      </main>

      <Footer />
      <WhatsAppButton />

      {isLeadModalOpen && (
        <LeadModal
          boatId={selectedBoatId}
          onClose={() => setIsLeadModalOpen(false)}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/catalogo"
          element={
            <PublicLayout>
              <Catalog />
            </PublicLayout>
          }
        />
        <Route
          path="/vender"
          element={
            <PublicLayout>
              <Sell />
            </PublicLayout>
          }
        />
        <Route
          path="/inspecao"
          element={
            <PublicLayout>
              <Inspection />
            </PublicLayout>
          }
        />
        <Route
          path="/estaleiros"
          element={
            <PublicLayout>
              <Shipyards />
            </PublicLayout>
          }
        />
        <Route
          path="/marcas"
          element={
            <PublicLayout>
              <Brands />
            </PublicLayout>
          }
        />
        <Route
          path="/sobre"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/contato"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
