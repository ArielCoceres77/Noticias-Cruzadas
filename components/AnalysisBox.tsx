
import React from 'react';
import { EducationalAnalysis } from '../types';

interface AnalysisBoxProps {
  analysis: EducationalAnalysis;
}

export const AnalysisBox: React.FC<AnalysisBoxProps> = ({ analysis }) => {
  return (
    <div className="mt-12 p-8 bg-slate-900/60 border border-slate-700/50 rounded-3xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-500/20 p-2 rounded-lg">
          <i className="fas fa-chalkboard-teacher text-emerald-400 text-xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-100">🧐 Análisis Docente</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <h4 className="text-emerald-400 font-semibold flex items-center gap-2">
            <i className="fas fa-bullhorn text-sm"></i> Uso de la Voz
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            {analysis.voiceUsage}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-emerald-400 font-semibold flex items-center gap-2">
            <i className="fas fa-language text-sm"></i> Léxico Comparado
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            {analysis.lexicalComparison}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-emerald-400 font-semibold flex items-center gap-2">
            <i className="fas fa-bullseye text-sm"></i> Intencionalidad
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            {analysis.intentionality}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-500 italic">
          Recuerda: El periodismo no es neutral; es una construcción mediada por intereses y lenguajes.
        </p>
      </div>
    </div>
  );
};
