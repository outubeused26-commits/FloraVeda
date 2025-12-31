import React from 'react';
import { LeafIcon, HomeIcon } from './Icons';

interface HeaderProps {
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="glass-panel border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center space-x-3 group focus:outline-none"
        >
          <div className="bg-jungle-500/20 p-2 rounded-xl group-hover:bg-jungle-500/30 transition-colors">
            <LeafIcon className="w-8 h-8 text-jungle-300" />
          </div>
          <span className="text-2xl font-display font-bold text-white tracking-wide">FloraVeda<span className="text-jungle-400">.ai</span></span>
        </button>
        
        <div className="flex items-center space-x-4">
          {/* Desktop Home Button */}
          <button 
             onClick={onReset}
             className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all text-sm font-medium group"
           >
             <HomeIcon className="w-4 h-4 group-hover:text-jungle-300 transition-colors" />
             <span>Home</span>
           </button>

          <div className="hidden md:flex items-center space-x-4">
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-jungle-100 uppercase tracking-wider">
              Gemini 3.0 Pro
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;