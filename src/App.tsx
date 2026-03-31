/**
 * @license
 * AI Glossary Pro - Mobile First UI
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Terminal, 
  Wrench, 
  BookOpen, 
  Plus, 
  Search, 
  Copy, 
  ExternalLink, 
  X,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Prompt {
  id: string;
  titulo: string;
  contenido: string;
  tipo: string;
  herramienta: string;
  tags: string;
  fecha: string;
}

interface Tool {
  id: string;
  nombre: string;
  url: string;
  descripcion: string;
  tipo: string;
  precio: string;
}

interface GlossaryItem {
  id: string;
  termino: string;
  definicion: string;
  ejemplo: string;
  tags: string;
}

type View = 'home' | 'prompts' | 'tools' | 'glossary';

// --- Mock Data ---
const MOCK_PROMPTS: Prompt[] = [
  { id: '1', titulo: 'Generador de Código React', contenido: 'Actúa como un experto en React y Tailwind. Crea un componente de...', tipo: 'Desarrollo', herramienta: 'ChatGPT', tags: 'react,tailwind', fecha: '2024-03-31' },
  { id: '2', titulo: 'Análisis de Datos Python', contenido: 'Analiza el siguiente dataset y genera un resumen estadístico...', tipo: 'Datos', herramienta: 'Claude', tags: 'python,data', fecha: '2024-03-30' },
];

const MOCK_TOOLS: Tool[] = [
  { id: '1', nombre: 'ChatGPT', url: 'https://chat.openai.com', descripcion: 'Modelo de lenguaje versátil de OpenAI.', tipo: 'Chatbot', precio: 'Freemium' },
  { id: '2', nombre: 'Midjourney', url: 'https://midjourney.com', descripcion: 'Generación de imágenes de alta calidad.', tipo: 'Imagen', precio: 'Pago' },
];

const MOCK_GLOSSARY: GlossaryItem[] = [
  { id: '1', termino: 'LLM', definicion: 'Large Language Model. Modelo de IA entrenado en grandes cantidades de texto.', ejemplo: 'GPT-4, Claude 3', tags: 'conceptos' },
  { id: '2', termino: 'Prompt Engineering', definicion: 'El arte de diseñar entradas para obtener mejores resultados de la IA.', ejemplo: 'Usar el framework RGC (Rol, Grado, Contexto)', tags: 'técnicas' },
];

export default function App() {
  const [isStandalone, setIsStandalone] = useState(true);
  const [activeView, setActiveView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // Detectar si la app está en modo "Añadida a la pantalla de inicio"
    const isViewStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(!!isViewStandalone);
  }, []);

  // --- Handlers ---
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Prompt copiado al portapapeles');
  };

  // --- Components ---
  const Navbar = () => (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-950/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-6 pb-safe z-50">
      <NavButton icon={<Home size={24} />} label="Inicio" active={activeView === 'home'} onClick={() => setActiveView('home')} />
      <NavButton icon={<Terminal size={24} />} label="Prompts" active={activeView === 'prompts'} onClick={() => setActiveView('prompts')} />
      <NavButton icon={<Wrench size={24} />} label="Tools" active={activeView === 'tools'} onClick={() => setActiveView('tools')} />
      <NavButton icon={<BookOpen size={24} />} label="Glosario" active={activeView === 'glossary'} onClick={() => setActiveView('glossary')} />
    </nav>
  );

  const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-violet-400' : 'text-slate-500'}`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );

  const Header = () => {
    const titles = { home: 'AI Hub', prompts: 'Mis Prompts', tools: 'Herramientas', glossary: 'Glosario IA' };
    return (
      <header className="p-6 pt-12 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase text-violet-500 tracking-[0.2em] mb-1">Khabron Pro</p>
          <h1 className="text-3xl font-black text-white">{titles[activeView]}</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-600/20 active:scale-90 transition-transform"
        >
          <Plus className="text-white" size={28} />
        </button>
      </header>
    );
  };

  const SearchBar = () => (
    <div className="px-6 mb-6">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Buscar contenido..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-violet-500/50 transition-all text-sm backdrop-blur-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-violet-500/30 overflow-hidden h-screen fixed inset-0">
      <div className="max-w-md mx-auto relative h-full flex flex-col">
        {!isStandalone && (
          <div className="bg-violet-600 p-3 text-center text-[10px] font-black uppercase tracking-widest animate-pulse z-[70]">
            Para pantalla completa: Añade esta App a tu escritorio
          </div>
        )}
        <Header />
        {activeView !== 'home' && <SearchBar />}

        <main className="flex-1 px-6 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'home' && <HomeView onNavigate={setActiveView} />}
              {activeView === 'prompts' && <PromptsView query={searchQuery} onCopy={copyToClipboard} />}
              {activeView === 'tools' && <ToolsView query={searchQuery} />}
              {activeView === 'glossary' && <GlossaryView query={searchQuery} />}
            </motion.div>
          </AnimatePresence>
        </main>

        <Navbar />

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: 20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              className="fixed bottom-24 left-1/2 bg-violet-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 z-[100]"
            >
              <CheckCircle2 size={18} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="relative w-full max-w-sm bg-slate-900 rounded-3xl border border-white/10 p-8 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Nuevo Registro</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); showToast('Guardado con éxito'); }}>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Título / Nombre</label>
                    <input type="text" className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 outline-none focus:border-violet-500 transition-all" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Descripción / Contenido</label>
                    <textarea rows={4} className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 outline-none focus:border-violet-500 transition-all" required />
                  </div>
                  <button type="submit" className="w-full bg-violet-600 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-violet-600/20 active:scale-95 transition-transform">
                    Guardar Registro
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Sub-Views ---

function HomeView({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 to-blue-700 p-8 shadow-2xl shadow-violet-600/20">
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white mb-2 leading-tight">Tu Glosario de IA Inteligente</h2>
          <p className="text-white/70 text-sm mb-6">Gestiona prompts, herramientas y conceptos en tiempo real.</p>
          <button 
            onClick={() => onNavigate('prompts')}
            className="bg-white text-violet-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-transform"
          >
            Empezar ahora <ChevronRight size={16} />
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <QuickAction icon={<Terminal className="text-violet-400" />} label="Prompts" count={MOCK_PROMPTS.length} onClick={() => onNavigate('prompts')} />
        <QuickAction icon={<Wrench className="text-blue-400" />} label="Tools" count={MOCK_TOOLS.length} onClick={() => onNavigate('tools')} />
        <QuickAction icon={<BookOpen className="text-emerald-400" />} label="Glosario" count={MOCK_GLOSSARY.length} onClick={() => onNavigate('glossary')} />
        <QuickAction icon={<Terminal className="text-amber-400" />} label="Resultados" count={0} onClick={() => {}} />
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Actividad Reciente</h3>
        <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5 space-y-4">
          {MOCK_PROMPTS.slice(0, 2).map(p => (
            <div key={p.id} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400">
                <Terminal size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{p.titulo}</p>
                <p className="text-[10px] text-slate-500">{p.fecha}</p>
              </div>
              <ChevronRight size={16} className="text-slate-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, count, onClick }: { icon: React.ReactNode, label: string, count: number, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 text-left space-y-4 active:scale-95 transition-all hover:bg-slate-900"
    >
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-lg font-black text-white">{count}</p>
        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">{label}</p>
      </div>
    </button>
  );
}

function PromptsView({ query, onCopy }: { query: string, onCopy: (t: string) => void }) {
  const filtered = MOCK_PROMPTS.filter(p => p.titulo.toLowerCase().includes(query.toLowerCase()) || p.contenido.toLowerCase().includes(query.toLowerCase()));
  
  return (
    <div className="space-y-4">
      {filtered.map(p => (
        <div key={p.id} className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white">{p.titulo}</h3>
              <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-1 rounded-lg font-bold uppercase">{p.tipo}</span>
            </div>
            <button onClick={() => onCopy(p.contenido)} className="p-3 bg-slate-800 rounded-xl text-slate-400 active:text-violet-400 transition-colors">
              <Copy size={18} />
            </button>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 italic">"{p.contenido}"</p>
          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-slate-600 font-bold uppercase">{p.herramienta}</span>
            <span className="text-[10px] text-slate-600">{p.fecha}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ToolsView({ query }: { query: string }) {
  const filtered = MOCK_TOOLS.filter(t => t.nombre.toLowerCase().includes(query.toLowerCase()) || t.descripcion.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4">
      {filtered.map(t => (
        <div key={t.id} className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white">{t.nombre}</h3>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg font-bold uppercase">{t.precio}</span>
          </div>
          <p className="text-sm text-slate-400">{t.descripcion}</p>
          <a 
            href={t.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-blue-400 active:scale-95 transition-transform"
          >
            Visitar Web <ExternalLink size={14} />
          </a>
        </div>
      ))}
    </div>
  );
}

function GlossaryView({ query }: { query: string }) {
  const filtered = MOCK_GLOSSARY.filter(g => g.termino.toLowerCase().includes(query.toLowerCase()) || g.definicion.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4">
      {filtered.map(g => (
        <div key={g.id} className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 space-y-4">
          <h3 className="text-xl font-black text-violet-400">{g.termino}</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{g.definicion}</p>
          <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] font-black uppercase text-slate-600 mb-1">Ejemplo</p>
            <p className="text-xs text-slate-400 italic">{g.ejemplo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
