
import React from 'react';
import { NewsVersion } from '../types';

interface NewsCardProps {
  version: NewsVersion;
  color: 'red' | 'blue' | 'slate';
}

export const NewsCard: React.FC<NewsCardProps> = ({ version, color }) => {
  const colorClasses = {
    red: 'border-red-500/30 bg-red-950/20 text-red-100',
    blue: 'border-blue-500/30 bg-blue-950/20 text-blue-100',
    slate: 'border-slate-500/30 bg-slate-900/40 text-slate-100'
  };

  const badgeClasses = {
    red: 'bg-red-500/20 text-red-400 border-red-500/50',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    slate: 'bg-slate-500/20 text-slate-400 border-slate-500/50'
  };

  return (
    <div className={`rounded-2xl border-2 transition-all flex flex-col h-full shadow-lg overflow-hidden ${colorClasses[color]}`}>
      {/* Header Badge */}
      <div className="px-6 pt-6 pb-2">
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${badgeClasses[color]}`}>
          {version.newspaper}
        </span>
      </div>

      {/* Image Section */}
      <div className="px-6 pt-2">
        <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden border border-white/5">
          {version.imageUrl ? (
            <img 
              src={version.imageUrl} 
              alt={version.headline} 
              className="w-full h-full object-cover animate-in fade-in duration-1000"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="fas fa-camera text-slate-700 text-3xl animate-pulse"></i>
            </div>
          )}
        </div>
        <p className="mt-2 text-[11px] leading-tight opacity-60 font-medium italic border-l-2 border-current pl-2">
          {version.epigraph}
        </p>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="serif text-2xl font-bold leading-tight mb-3 text-white">
          {version.headline}
        </h3>
        <p className="text-sm font-semibold opacity-90 mb-4 leading-snug">
          {version.subHeadline}
        </p>
        <div className="text-sm opacity-75 leading-relaxed space-y-2 text-justify">
          {version.body}
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="px-6 py-4 mt-auto border-t border-white/5 bg-black/10 flex justify-between items-center">
        <span className="text-[10px] opacity-40 font-mono uppercase">Edición Digital</span>
        <i className="fas fa-share-nodes text-xs opacity-30"></i>
      </div>
    </div>
  );
};
