import React, { useEffect, useState } from 'react';
import { Globe, ShieldCheck, Cpu, Wifi, Search, Database, CloudLightning } from 'lucide-react';

const steps = [
  { text: "Initializing Web Optimizer Engine...", icon: Cpu },
  { text: "Connecting to Google Live Index...", icon: Globe },
  { text: "Querying Real-Time Search Snippets...", icon: Search },
  { text: "Analyzing Competitor SERP Positions...", icon: Database },
  { text: "Extracting High-Value Niche Keywords...", icon: CloudLightning },
  { text: "Evaluating Core Web Vitals Signals...", icon: Wifi },
  { text: "Calculating Trust & Authority Score...", icon: ShieldCheck },
  { text: "Finalizing Optimization Matrix...", icon: Cpu }
];

const ScannerEffect: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500); // Slightly faster to feel energetic
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl">
      
      {/* Matrix Background Effect */}
      <div className="absolute inset-0 z-0 opacity-[0.03] font-mono text-xs leading-none text-slate-900 overflow-hidden pointer-events-none whitespace-pre-wrap select-none">
        {Array(400).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')}
      </div>
      
      {/* Central HUD */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Animated Circle */}
        <div className="relative w-40 h-40 mb-10">
          <div className="absolute inset-0 rounded-full border-t-4 border-cyan-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-4 border-blue-600 animate-spin-reverse"></div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <ActiveIcon className="w-16 h-16 text-cyan-600 animate-pulse" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight text-center">
          Live Audit In Progress
        </h2>
        
        <div className="h-8 flex items-center justify-center">
          <p className="text-cyan-600 font-mono text-lg animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            {">"} {steps[currentStep].text}
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-96 h-2 bg-slate-100 rounded-full mt-8 overflow-hidden border border-slate-200">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-progress origin-left"></div>
        </div>
      </div>

      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ScannerEffect;