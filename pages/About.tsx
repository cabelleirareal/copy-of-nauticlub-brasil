
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <section className="pt-32 pb-24 px-6 bg-primary text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-10">A NautiClub Brasil</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Nascemos da paixão pelo mar e da necessidade de elevar os padrões do mercado náutico brasileiro para níveis globais de excelência.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <img src="https://picsum.photos/seed/founder/800/1000" alt="Founders" className="rounded-[3rem] shadow-2xl" />
              <div className="absolute -bottom-10 -right-10 bg-accent p-10 rounded-[2rem] text-white shadow-xl max-w-[280px]">
                <p className="text-3xl font-display mb-2">Fundação</p>
                <p className="text-sm font-medium opacity-80">Uma história construída sobre confiança e paixão pela navegação.</p>
              </div>
            </div>
            <div>
              <span className="text-accent text-sm font-bold uppercase tracking-widest mb-4 block">Nossa História</span>
              <h2 className="font-display text-4xl text-primary mb-8">Navegando entre sonhos <br />e tecnologia.</h2>
              <div className="space-y-6 text-slate-500 leading-relaxed font-light">
                <p>
                  A NautiClub Brasil não é apenas um marketplace. Somos um ecossistema completo que integra inteligência de dados, perícia técnica e uma rede de contatos exclusiva para garantir que sua jornada no mar seja segura e inesquecível.
                </p>
                <p>
                  Atuamos em três pilares fundamentais: Curadoria de ativos, Consultoria de gestão e Inovação tecnológica. Através da representação de marcas líderes mundiais, trazemos o que há de mais moderno em conectividade e performance para o seu convés.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <h4 className="font-bold text-primary mb-2">Missão</h4>
                  <p className="text-xs text-slate-500">Transformar a experiência náutica através da segurança, transparência e tecnologia.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <h4 className="font-bold text-primary mb-2">Visão</h4>
                  <p className="text-xs text-slate-500">Ser a autoridade máxima em consultoria náutica na América Latina até 2026.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
