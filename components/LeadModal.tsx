
import React, { useState } from 'react';
import { Lead } from '../types';

interface LeadModalProps {
  boatId?: string;
  onClose: () => void;
}

const LeadModal: React.FC<LeadModalProps> = ({ boatId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(onClose, 2500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-primary/80 backdrop-blur-sm transition-opacity animate-in fade-in" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-icons-outlined">close</span>
        </button>

        <div className="p-8 md:p-12">
          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-outlined text-4xl">check_circle</span>
              </div>
              <h3 className="font-display text-2xl text-primary font-bold mb-2">Solicitação enviada!</h3>
              <p className="text-slate-500">Nossa equipe de especialistas entrará em contato em breve.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.2em]">Tenho Interesse</span>
                <h3 className="font-display text-3xl text-primary font-bold mt-1">Sua nova jornada começa aqui</h3>
                <p className="text-slate-500 text-sm mt-2">Preencha os dados abaixo e receba atendimento exclusivo.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Nome Completo</label>
                  <input required type="text" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-accent" placeholder="Como podemos te chamar?" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Telefone (WhatsApp)</label>
                    <input required type="tel" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-accent" placeholder="(00) 00000-0000" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">E-mail</label>
                    <input required type="email" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-accent" placeholder="exemplo@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Mensagem (Opcional)</label>
                  <textarea rows={3} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-accent resize-none" placeholder="Conte-nos um pouco sobre o que você busca..."></textarea>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Solicitar Consultoria'
                  )}
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  Ao enviar, você concorda com nossa Política de Privacidade.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadModal;
