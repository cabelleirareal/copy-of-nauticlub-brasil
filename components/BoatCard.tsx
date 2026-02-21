
import React from 'react';
import { Boat, BoatStatus } from '../types';

interface BoatCardProps {
  boat: Boat;
  onInterest: (id: string) => void;
}

const BoatCard: React.FC<BoatCardProps> = ({ boat, onInterest }) => {
  const formattedPrice = typeof boat.price === 'number' 
    ? boat.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : boat.price;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={boat.images[0]} 
          alt={boat.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {boat.featured && (
          <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur px-3 py-1 rounded-full">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Destaque</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{boat.status}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{boat.type} • {boat.year}</span>
          <h3 className="font-display text-xl text-primary font-bold mt-1 line-clamp-1">{boat.name}</h3>
        </div>

        <div className="flex gap-6 mt-auto mb-6 py-4 border-y border-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-accent text-lg">straighten</span>
            <span className="text-xs font-medium text-slate-500">{boat.size} ft</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-accent text-lg">group</span>
            <span className="text-xs font-medium text-slate-500">{boat.specs.pax} pax</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-accent text-lg">settings</span>
            <span className="text-xs font-medium text-slate-500">Dual Eng.</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Preço</span>
            <span className="text-lg font-bold text-primary">{formattedPrice}</span>
          </div>
          <button 
            onClick={() => onInterest(boat.id)}
            className="bg-accent hover:bg-primary text-white p-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            title="Tenho Interesse"
          >
            <span className="material-icons-outlined">chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoatCard;
