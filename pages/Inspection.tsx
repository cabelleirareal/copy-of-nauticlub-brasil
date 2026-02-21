
import React from 'react';

const Inspection: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <section className="relative h-[60vh] flex items-center bg-primary overflow-hidden">
        <img src="https://picsum.photos/seed/inspection-hero/1920/1080" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Segurança Técnica</span>
            <h1 className="font-display text-4xl md:text-6xl text-white font-bold mb-6 leading-tight">Auditoria & <br />Laudos Técnicos.</h1>
            <p className="text-slate-300 text-lg font-light leading-relaxed">
              Compre com a mente tranquila. Nossos peritos realizam vistorias minuciosas para garantir que você saiba exatamente o que está levando para o mar.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-display text-3xl text-primary font-bold mb-8">Por que agendar uma inspeção?</h2>
              <div className="space-y-6">
                {[
                  { title: 'Identificação de Vícios Ocultos', desc: 'Detectamos problemas estruturais ou de motorização que não são visíveis a olho nu.', icon: 'visibility_off' },
                  { title: 'Avaliação de Mercado Real', desc: 'Saiba se o valor pedido condiz com o estado real de conservação.', icon: 'trending_up' },
                  { title: 'Segurança da Família', desc: 'Garantimos que todos os itens de salvatagem e segurança estejam em conformidade.', icon: 'family_restroom' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <span className="material-icons-outlined text-accent text-sm">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-12 bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-widest py-5 px-10 rounded-full transition-all shadow-xl">
                Quero Agendar uma Inspeção
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://picsum.photos/seed/insp1/400/500" className="rounded-2xl shadow-lg w-full" />
                <div className="bg-accent p-6 rounded-2xl text-white">
                  <div className="text-3xl font-display mb-2">150+</div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Itens Verificados</p>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="bg-primary p-6 rounded-2xl text-white">
                  <div className="text-3xl font-display mb-2">24h</div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Entrega do Laudo</p>
                </div>
                <img src="https://picsum.photos/seed/insp2/400/500" className="rounded-2xl shadow-lg w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-primary mb-4">Etapas da Vistoria</h2>
            <p className="text-slate-500">Um processo transparente e rigoroso do agendamento à entrega.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Agendamento', desc: 'Definimos data e local da vistoria (Marina ou Estaleiro).' },
              { step: '02', title: 'Inspeção Física', desc: 'Análise detalhada de casco, sistemas e eletrônicos.' },
              { step: '03', title: 'Teste de Mar', desc: 'Avaliação de performance e comportamento em navegação.' },
              { step: '04', title: 'Laudo Digital', desc: 'Receba o relatório completo via e-mail e WhatsApp.' },
            ].map(item => (
              <div key={item.step} className="bg-white p-8 rounded-3xl border border-slate-100 relative group">
                <span className="text-6xl font-display text-slate-50 absolute top-4 right-4 group-hover:text-accent/10 transition-colors">{item.step}</span>
                <div className="relative z-10">
                  <h4 className="font-bold text-primary mb-4">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inspection;
