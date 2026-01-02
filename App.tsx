
import React, { useState, useEffect } from 'react';
import { analyzeNews, generateNewsImage } from './services/geminiService';
import { AnalysisResponse, AppStatus } from './types';
import { NewsCard } from './components/NewsCard';
import { AnalysisBox } from './components/AnalysisBox';

const LOGO_URL = "https://lh3.googleusercontent.com/sitesv/AAzXCke8RkfhwuZHoB0Vg0rNUa4G22hoW741gZfh8noOFxhNNVc7y8UQi9Cv7gbKXEPvwcEvGUuGhOZDMzm84jBSNyPfuTjv4Wj_pvjT1OF27JrFY78JiWelyyWtQPQGVzfixXDeSp9Ykp79LTN5zMZ6OhMAwZR-WFU0Db_XbGv1a9fa3_X4cCZME03NgJnjvtlxKYQ8xSABsA-dXBL3ByRAhLZZumJ2CmBhnoLIMbM=w1280";

const App: React.FC = () => {
  const [fact, setFact] = useState('');
  const [status, setStatus] = useState<AppStatus>('idle');
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fact.trim()) return;

    setStatus('loading');
    setError(null);
    setResult(null);

    try {
      // Step 1: Generate Text Content
      const data = await analyzeNews(fact);
      
      if (data.baseFact.includes('ingresa un hecho noticioso')) {
        setError(data.baseFact);
        setStatus('error');
        return;
      }

      setResult(data);
      setStatus('success');

      // Step 2: Generate Images in parallel for each version
      const imagePromises = [
        generateNewsImage(data.sensationalist.epigraph, "Sensationalist, dramatic, high contrast"),
        generateNewsImage(data.officialist.epigraph, "Official, clean, positive, institutional"),
        generateNewsImage(data.oppositional.epigraph, "Gritty, critical, urban, dramatic")
      ];

      const [imgSens, imgOff, imgOpp] = await Promise.allSettled(imagePromises);

      setResult(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          sensationalist: { ...prev.sensationalist, imageUrl: imgSens.status === 'fulfilled' ? imgSens.value : undefined },
          officialist: { ...prev.officialist, imageUrl: imgOff.status === 'fulfilled' ? imgOff.value : undefined },
          oppositional: { ...prev.oppositional, imageUrl: imgOpp.status === 'fulfilled' ? imgOpp.value : undefined }
        };
      });

    } catch (err) {
      console.error(err);
      setError('Hubo un error procesando el hecho. Intenta de nuevo.');
      setStatus('error');
    }
  };

  const loadingMessages = [
    "Consultando redacciones...",
    "Analizando sesgos editoriales...",
    "Cargando tinta digital...",
    "Generando evidencias visuales...",
    "Dramatizando titulares...",
    "Revelando fotografías...",
    "Preparando el pizarrón docente..."
  ];
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  useEffect(() => {
    let interval: any;
    if (status === 'loading') {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="min-h-screen pb-20 selection:bg-emerald-500/30">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Noticias Cruzadas" className="h-12 w-auto object-contain rounded" />
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent hidden sm:block">
              NOTICIAS CRUZADAS
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden lg:block text-[10px] font-bold text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 uppercase tracking-widest">
              Laboratorio de Crítica Mediática
            </span>
            <button className="text-slate-400 hover:text-emerald-400 transition-colors">
              <i className="fas fa-circle-info text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-12">
        {/* Intro */}
        <section className="text-center mb-16 space-y-4">
          <h2 className="serif text-5xl sm:text-6xl font-bold tracking-tight">Un hecho, tres realidades.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Descubre cómo la misma información puede transformarse radicalmente según quién la cuente y qué busque provocar en ti.
          </p>
        </section>

        {/* Input Form */}
        <section className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleAnalyze} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/50 via-blue-500/50 to-emerald-500/50 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-900 rounded-2xl p-2.5 flex items-center shadow-2xl border border-slate-700/50">
              <div className="pl-4 text-slate-500">
                <i className="fas fa-newspaper"></i>
              </div>
              <input
                type="text"
                value={fact}
                onChange={(e) => setFact(e.target.value)}
                placeholder="Escribe un hecho base (ej: El gobierno anunció un nuevo impuesto...)"
                className="flex-grow bg-transparent border-none focus:ring-0 px-4 py-4 text-slate-100 placeholder:text-slate-500 text-lg"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading' || !fact.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-black px-10 py-4 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                {status === 'loading' ? (
                  <i className="fas fa-circle-notch fa-spin"></i>
                ) : (
                  <i className="fas fa-bolt-lightning"></i>
                )}
                <span className="hidden sm:inline">REVELAR SESGOS</span>
              </button>
            </div>
          </form>
          {error && (
            <p className="text-red-400 text-center mt-6 text-sm font-medium bg-red-950/30 py-3 rounded-xl border border-red-500/30 animate-shake">
              <i className="fas fa-triangle-exclamation mr-2"></i> {error}
            </p>
          )}
        </section>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <div className="relative w-24 h-24">
               <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
               <div className="absolute inset-2 border-4 border-blue-500/20 rounded-full"></div>
               <div className="absolute inset-2 border-4 border-blue-500 border-b-transparent rounded-full animate-spin-reverse"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-emerald-400 text-xl font-bold tracking-tight">
                {loadingMessages[loadingMsgIdx]}
              </p>
              <p className="text-slate-500 text-sm animate-pulse">Esto puede tomar unos segundos mientras las redacciones cierran...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {status === 'success' && result && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Fact Banner */}
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl flex flex-col items-center gap-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                  <i className="fas fa-quote-left"></i>
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Hecho Base Verificado</h3>
              </div>
              <p className="text-slate-200 text-2xl font-medium text-center max-w-4xl leading-relaxed">
                "{result.baseFact}"
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <NewsCard version={result.sensationalist} color="red" />
              <NewsCard version={result.officialist} color="blue" />
              <NewsCard version={result.oppositional} color="slate" />
            </div>

            {/* Analysis Box */}
            <AnalysisBox analysis={result.educationalAnalysis} />
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-32 border-t border-slate-800 pt-16 text-center text-slate-500 text-sm bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <img src={LOGO_URL} alt="Footer Logo" className="h-8 mx-auto opacity-30 grayscale hover:grayscale-0 transition-all mb-8" />
          <p className="font-medium">© 2024 Noticias Cruzadas | Proyecto Educativo para el Análisis Crítico del Discurso</p>
          <p className="text-xs mt-2 opacity-60">Diseñado para fomentar la alfabetización mediática en el siglo XXI.</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-10">
            <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
              <i className="fas fa-book-open"></i> Guía Docente
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
              <i className="fas fa-spell-check"></i> Glosario de Sesgos
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
              <i className="fas fa-scale-balanced"></i> Ética Periodística
            </a>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default App;
