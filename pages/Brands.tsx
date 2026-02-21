
import React from 'react';
import { BRANDS } from '../constants';

const Brands: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <section className="bg-nauti-bg pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Representação Oficial</span>
          <h1 className="font-display text-4xl md:text-6xl text-primary font-bold mb-6">Nossas Marcas</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-lg">
            A NautiClub representa oficialmente marcas que compartilham nossa visão de inovação, luxo e performance extrema no ambiente marítimo.
          </p>
        </div>
      </section>

      <section className="px-6 -mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {BRANDS.map(brand => (
              <div key={brand.id} className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-50 flex flex-col items-center text-center group transition-all duration-500 hover:-translate-y-2">
                <div className="w-40 h-24 mb-10 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-2">{brand.category}</span>
                <h3 className="font-display text-2xl text-primary font-bold mb-4">{brand.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-10 flex-grow">{brand.description}</p>
                <button className="w-full bg-slate-50 hover:bg-primary hover:text-white text-primary font-bold text-[10px] uppercase tracking-widest py-4 rounded-2xl transition-all">
                  Saber Mais / Orçamento
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white mt-24">
        <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://picsum.photos/seed/tech/1920/1080')] bg-cover" />
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-8">Destaque Starlink Maritime</h2>
            <p className="text-slate-300 mb-10 text-lg font-light leading-relaxed">
              Leve a internet de ultra-velocidade para alto mar. Conectividade estável em qualquer coordenada do planeta, exclusiva para nossos clientes premium.
            </p>
            <button className="bg-white text-primary font-bold text-xs uppercase tracking-widest py-5 px-10 rounded-full hover:bg-accent hover:text-white transition-all shadow-xl">
              Solicitar Projeto de Instalação
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Brands;
