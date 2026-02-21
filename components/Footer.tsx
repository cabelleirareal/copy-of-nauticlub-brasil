
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <span className="material-icons-outlined text-accent text-4xl group-hover:rotate-12 transition-transform">anchor</span>
              <span className="font-display text-2xl font-bold tracking-tight text-white">NAUTICLUB</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              A maior referência em excelência náutica no Brasil. Unindo luxo, segurança e tecnologia para transformar seu estilo de vida no mar.
            </p>
            <div className="flex gap-4">
              {['facebook', 'camera_alt', 'play_circle'].map((icon) => (
                <a key={icon} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent transition-all">
                  <span className="material-icons-outlined text-xl">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-8">Navegação</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/catalogo" className="text-slate-400 hover:text-white transition-colors">Catálogo Premium</Link></li>
              <li><Link to="/vender" className="text-slate-400 hover:text-white transition-colors">Vender meu Barco</Link></li>
              <li><Link to="/inspecao" className="text-slate-400 hover:text-white transition-colors">Inspeção Técnica</Link></li>
              <li><Link to="/estaleiros" className="text-slate-400 hover:text-white transition-colors">Consultoria B2B</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-8">Institucional</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/sobre" className="text-slate-400 hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link to="/marcas" className="text-slate-400 hover:text-white transition-colors">Nossas Marcas</Link></li>
              <li><Link to="/contato" className="text-slate-400 hover:text-white transition-colors">Contato</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Trabalhe Conosco</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-8">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-6">Fique por dentro das novidades do mundo náutico.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="bg-white/5 border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:ring-accent focus:border-accent"
              />
              <button className="bg-accent hover:bg-white hover:text-primary text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all">
                Inscrever
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
            © 2024 NautiClub Brasil. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-[10px] text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
