
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-nauti-bg animate-in fade-in duration-500 pb-24">
      <div className="bg-primary pt-32 pb-48 px-6 text-center text-white relative">
        <div className="max-w-4xl mx-auto">
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Fale Conosco</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">Estamos a um porto <br />de distância.</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-lg">
            Nossa equipe de especialistas está pronta para tirar suas dúvidas e iniciar sua jornada conosco.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Nome Completo" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-accent" />
                <input type="email" placeholder="E-mail" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-accent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="tel" placeholder="WhatsApp" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-accent" />
                <select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-accent text-slate-400">
                  <option>Assunto</option>
                  <option>Comprar Barco</option>
                  <option>Vender meu Barco</option>
                  <option>Inspeção Técnica</option>
                  <option>Estaleiros</option>
                </select>
              </div>
              <textarea rows={5} placeholder="Sua mensagem..." className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-accent resize-none"></textarea>
              <button className="bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-widest py-5 px-10 rounded-2xl transition-all shadow-xl w-full">
                Enviar Mensagem
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl">
              <h4 className="font-display text-2xl text-primary font-bold mb-8">Informações</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="material-icons-outlined text-accent">location_on</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Endereço</p>
                    <p className="text-sm text-primary">Av. Atlântica, 4500 - Balneário Camboriú, SC</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-icons-outlined text-accent">call</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Telefone</p>
                    <p className="text-sm text-primary">+55 (47) 99999-0000</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-icons-outlined text-accent">email</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">E-mail</p>
                    <p className="text-sm text-primary">contato@nauticlub.com.br</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col items-center text-center">
              <span className="material-icons-outlined text-5xl mb-6">chat_bubble_outline</span>
              <h4 className="font-display text-xl font-bold mb-4">Atendimento Ágil</h4>
              <p className="text-white/80 text-sm mb-8 leading-relaxed">Prefere falar agora? Nossos consultores estão online no WhatsApp.</p>
              <a href="https://wa.me/550000000000" target="_blank" className="bg-white text-primary font-bold text-[10px] uppercase tracking-[0.2em] py-4 px-8 rounded-xl w-full">
                Abrir WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Placeholder */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="w-full h-[400px] bg-slate-200 rounded-[3rem] overflow-hidden grayscale relative border-4 border-white shadow-2xl">
           <img src="https://picsum.photos/seed/map-location/1200/400" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-primary/10" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="bg-white p-4 rounded-full shadow-2xl animate-float">
               <span className="material-icons-outlined text-accent text-3xl">anchor</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
