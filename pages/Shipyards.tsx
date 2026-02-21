
import React from 'react';

const Shipyards: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <section className="bg-white pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">B2B Solutions</span>
            <h1 className="font-display text-4xl md:text-6xl text-primary font-bold mb-8 leading-tight">Impulsione seu <br />Estaleiro ao Topo.</h1>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-light">
              Oferecemos consultoria técnica e comercial estratégica para fabricantes. Do design de novas linhas à otimização de vendas, somos seu parceiro de crescimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-widest py-5 px-10 rounded-full transition-all shadow-xl">
                Agendar Consultoria Técnica
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-nauti-bg rounded-[3rem] p-4">
              <img src="https://picsum.photos/seed/shipyard/800/600" className="rounded-[2.5rem] w-full shadow-2xl" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-[240px]">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-bold">Expertise Garantida</p>
              <p className="text-sm font-bold text-primary italic">"A NautiClub elevou nossa conversão de leads em 40% em apenas um semestre."</p>
              <p className="text-[10px] text-accent font-bold mt-2 uppercase tracking-widest">— Diretor, Estaleiro X</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-primary text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl mb-4">Nossos Serviços para Estaleiros</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Soluções modulares para cada fase do seu negócio.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Design & Inovação', desc: 'Consultoria técnica para desenvolvimento de novos moldes e layout interno.', icon: 'architecture' },
              { title: 'Treinamento Comercial', desc: 'Capacite sua equipe de vendas para fechamentos de alto valor.', icon: 'groups' },
              { title: 'Marketing de Luxo', desc: 'Posicionamento de marca e gestão de leads exclusivos para o mercado náutico.', icon: 'campaign' },
            ].map(item => (
              <div key={item.title} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-accent transition-all duration-300 group">
                <span className="material-icons-outlined text-accent text-4xl mb-6 block">{item.icon}</span>
                <h4 className="text-xl font-display mb-4">{item.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shipyards;
