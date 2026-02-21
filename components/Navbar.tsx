
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Catálogo', path: '/catalogo' },
    { label: 'Vender', path: '/vender' },
    { label: 'Inspeção', path: '/inspecao' },
    { label: 'Estaleiros', path: '/estaleiros' },
    { label: 'Marcas', path: '/marcas' },
    { label: 'Sobre', path: '/sobre' },
    { label: 'Contato', path: '/contato' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className={`material-icons-outlined text-accent text-3xl transition-transform group-hover:rotate-12`}>anchor</span>
          <span className={`font-display text-xl font-bold tracking-tight ${
            scrolled || location.pathname !== '/' ? 'text-primary' : 'text-white'
          }`}>
            NAUTICLUB
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs font-semibold uppercase tracking-widest transition-colors hover:text-accent ${
                scrolled || location.pathname !== '/' 
                ? (location.pathname === item.path ? 'text-accent' : 'text-primary')
                : 'text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-2 rounded-md ${
            scrolled || location.pathname !== '/' ? 'text-primary' : 'text-white'
          }`}
        >
          <span className="material-icons-outlined text-3xl">
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`text-sm font-semibold uppercase tracking-widest p-2 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-accent/10 text-accent' : 'text-primary hover:bg-slate-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
