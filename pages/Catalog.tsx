
import React, { useState, useMemo } from 'react';
import BoatCard from '../components/BoatCard';
import { BOATS } from '../constants';

interface CatalogProps {
  onOpenLead: (id?: string) => void;
}

const Catalog: React.FC<CatalogProps> = ({ onOpenLead }) => {
  const [filterType, setFilterType] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const types = ['Todos', 'Yachts', 'Cruiser', 'Sport', 'Jet Ski'];

  const filteredBoats = useMemo(() => {
    return BOATS.filter(boat => {
      const matchesType = filterType === 'Todos' || boat.type === filterType;
      const matchesSearch = boat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           boat.brand.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filterType, searchTerm]);

  return (
    <div className="min-h-screen bg-nauti-bg animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-primary pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Portfólio Exclusivo</span>
          <h1 className="font-display text-4xl md:text-6xl text-white font-bold mb-6">Catálogo de Embarcações</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-lg font-light leading-relaxed">
            Explore nossa seleção criteriosamente curada das melhores embarcações do mercado nacional e internacional.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 mb-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-4 md:p-8 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-grow w-full">
            <div className="relative">
              <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Buscar por modelo, marca ou ano..." 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex overflow-x-auto gap-2 w-full lg:w-auto hide-scrollbar pb-2 lg:pb-0">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filterType === type 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {filteredBoats.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Mostrando {filteredBoats.length} embarcações
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredBoats.map(boat => (
                <BoatCard 
                  key={boat.id} 
                  boat={boat} 
                  onInterest={(id) => onOpenLead(id)} 
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm">
            <span className="material-icons-outlined text-6xl text-slate-100 mb-6">sailing</span>
            <h3 className="text-xl font-display text-primary font-bold mb-2">Nenhum barco encontrado</h3>
            <p className="text-slate-400 text-sm">Tente ajustar seus filtros ou busca.</p>
            <button 
              onClick={() => {setFilterType('Todos'); setSearchTerm('');}}
              className="mt-8 text-accent font-bold text-xs uppercase tracking-widest border-b-2 border-accent pb-1"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
