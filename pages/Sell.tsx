
import React, { useState } from 'react';

const Sell: React.FC = () => {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-nauti-bg animate-in fade-in duration-500 pb-20">
      <div className="bg-primary pt-32 pb-48 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/sea-texture/1920/600')] bg-cover mix-blend-overlay" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Anuncie Conosco</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-8 leading-tight">Venda seu barco com <br />quem entende do mar.</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-lg">
            Nossa plataforma conecta sua embarcação aos compradores mais qualificados do Brasil, com assessoria completa durante todo o processo.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl">
              <h3 className="font-display text-2xl text-primary font-bold mb-8">Por que nos escolher?</h3>
              {[
                { title: 'Exposição Nacional', desc: 'Sua embarcação vista por milhares de leads qualificados mensalmente.', icon: 'public' },
                { title: 'Taxas Justas', desc: 'Trabalhamos com transparência e as melhores condições do mercado.', icon: 'payments' },
                { title: 'Assessoria Premium', desc: 'Cuidamos de toda a documentação e fotos profissionais.', icon: 'camera_alt' },
              ].map(item => (
                <div key={item.title} className="flex gap-4 mb-8 last:mb-0">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="material-icons-outlined text-accent">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-primary mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
              {success ? (
                <div className="text-center py-20">
                  <span className="material-icons-outlined text-6xl text-green-500 mb-6">check_circle</span>
                  <h3 className="font-display text-3xl text-primary font-bold mb-4">Proposta recebida!</h3>
                  <p className="text-slate-500">Nossos consultores analisarão os dados e entrarão em contato em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="mb-10">
                    <h3 className="font-display text-2xl text-primary font-bold mb-2">Dados da Embarcação</h3>
                    <p className="text-slate-400 text-xs uppercase tracking-widest">Preencha o máximo de informações possível</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Marca / Modelo</label>
                      <input required type="text" className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-sm focus:ring-accent" placeholder="Ex: Fibrafort Focker 305" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Ano</label>
                      <input required type="number" className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-sm focus:ring-accent" placeholder="Ex: 2021" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Tamanho (pés)</label>
                      <input required type="number" className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-sm focus:ring-accent" placeholder="Ex: 30" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Preço Pretendido</label>
                      <input required type="text" className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-sm focus:ring-accent" placeholder="R$ 0,00" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50">
                    <h3 className="font-display text-xl text-primary font-bold mb-6">Seus Contatos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input required type="text" className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-sm focus:ring-accent" placeholder="Seu nome" />
                      <input required type="tel" className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-sm focus:ring-accent" placeholder="Seu WhatsApp" />
                    </div>
                  </div>

                  <button className="w-full bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-[0.2em] py-5 rounded-xl shadow-lg transition-all duration-300">
                    Enviar para Avaliação
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;
