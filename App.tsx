
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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
import WhatsAppButton from './components/WhatsAppButton';
import LeadModal from './components/LeadModal';
import { Lead } from './types';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedBoatId, setSelectedBoatId] = useState<string | undefined>(undefined);

  const openLeadModal = (boatId?: string) => {
    setSelectedBoatId(boatId);
    setIsLeadModalOpen(true);
  };

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home onOpenLead={openLeadModal} />} />
            <Route path="/catalogo" element={<Catalog onOpenLead={openLeadModal} />} />
            <Route path="/vender" element={<Sell />} />
            <Route path="/inspecao" element={<Inspection />} />
            <Route path="/estaleiros" element={<Shipyards />} />
            <Route path="/marcas" element={<Brands />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
          </Routes>
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
    </HashRouter>
  );
};

export default App;
