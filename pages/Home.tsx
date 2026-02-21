
import React from 'react';
import { Link } from 'react-router-dom';
import BoatCard from '../components/BoatCard';
import { BOATS } from '../constants';

interface HomeProps {
  onOpenLead: (id?: string) => void;
}

const Home: React.FC<HomeProps> = ({ onOpenLead }) => {
  const featuredBoats = BOATS.filter(b => b.featured);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://picsum.photos/seed/yacht-hero/1920/1080" 
          alt="Luxury Yacht" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/90" />
        
        <div className="relative z-10 px-6 text-center max-w-4xl mx-auto">
          <span className="inline-block text-accent font-bold text-xs md:text-sm uppercase tracking-[0.5em] mb-6 animate-in slide-in-from-bottom-4 duration-1000">
            NautiClub Brasil • High Standards
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight animate-in slide-in-from-bottom-8 duration-1000 delay-100">
            O horizonte é apenas o <span className="italic text-accent">começo.</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed animate-in slide-in-from-bottom-12 duration-1000 delay-200">
            A plataforma definitiva para quem vive a excelência náutica. Curadoria exclusiva de embarcações, inspeções técnicas e consultoria estratégica.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link 
              to="/catalogo" 
              className="w-full sm:w-auto bg-accent hover:bg-white hover:text-primary text-white font-bold text-xs uppercase tracking-[0.2em] py-5 px-10 rounded-full transition-all duration-300 shadow-xl"
            >
              Ver Catálogo Premium
            </Link>
            <Link 
              to="/vender" 
              className="w-full sm:w-auto glass hover:bg-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] py-5 px-10 rounded-full transition-all duration-300"
            >
              Vender meu Barco
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="material-icons-outlined text-white/40 text-4xl">expand_more</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Inspeção', icon: 'verified', path: '/inspecao' },
              { label: 'Consultoria', icon: 'business', path: '/estaleiros' },
              { label: 'Marcas', icon: 'stars', path: '/marcas' },
              { label: 'Falar agora', icon: 'support_agent', path: '/contato' },
            ].map((item) => (
              <Link key={item.label} to={item.path} className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <span className="material-icons-outlined text-accent group-hover:text-white transition-colors">{item.icon}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-24 px-6 bg-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 border-l-2 border-t-2 border-accent/30" />
            <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Nosso Manifesto</span>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-8 leading-tight">
              Excelência além da <br />superfície.
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed font-light text-lg">
              <p>
                Na <strong className="text-white font-semibold italic">NautiClub Brasil</strong>, entendemos que um barco não é apenas um bem material, mas o cenário de memórias que durarão gerações.
              </p>
              <p>
                Nossa missão é democratizar o acesso à alta consultoria náutica, oferecendo ferramentas de ponta para compradores exigentes e soluções robustas para donos de estaleiros.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 mt-12 pt-12 border-t border-white/10">
              <div>
                <div className="text-4xl font-display text-accent mb-2">15k+</div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Embarcações Curadas</p>
              </div>
              <div>
                <div className="text-4xl font-display text-accent mb-2">100%</div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Segurança Jurídica</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img src="https://picsum.photos/seed/nautical-man/800/1000" alt="Consultant" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-r-2 border-b-2 border-accent/30" />
          </div>
        </div>
      </section>

      {/* Featured Boats */}
      <section className="py-24 px-6 bg-nauti-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-2 block">Seleção Especial</span>
              <h2 className="font-display text-4xl text-primary font-bold">Embarcações em Destaque</h2>
            </div>
            <Link to="/catalogo" className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-accent transition-colors">
              Ver Catálogo Completo <span className="material-icons-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBoats.map(boat => (
              <BoatCard 
                key={boat.id} 
                boat={boat} 
                onInterest={(id) => onOpenLead(id)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl text-primary mb-4">Por que a NautiClub?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Mais do que uma plataforma de anúncios, somos seu braço direito na água.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Vistoria 360°', desc: 'Checklist rigoroso de mais de 150 itens em cada embarcação premium.', icon: 'fact_check' },
            { title: 'Negociação Direta', desc: 'Sem intermediários desnecessários. Transparência total do início ao fim.', icon: 'handshake' },
            { title: 'Apoio Jurídico', desc: 'Contratos validados por especialistas em direito marítimo brasileiro.', icon: 'gavel' },
          ].map((item) => (
            <div key={item.title} className="text-center p-8 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                <span className="material-icons-outlined text-accent group-hover:text-white transition-colors">{item.icon}</span>
              </div>
              <h4 className="font-bold text-primary mb-3">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden relative bg-primary py-20 px-10 text-center">
          <img src="https://picsum.photos/seed/cta-bg/1920/600" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-5xl text-white mb-8">Pronto para subir a bordo?</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-12 text-lg">
              Seja para comprar seu primeiro barco ou para otimizar sua linha de produção em estaleiro, temos a solução ideal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onOpenLead()}
                className="bg-accent hover:bg-white hover:text-primary text-white font-bold text-xs uppercase tracking-[0.2em] py-5 px-10 rounded-full transition-all shadow-xl"
              >
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
