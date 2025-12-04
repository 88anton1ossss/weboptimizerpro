import React from 'react';
import { AuditSection } from '../types';
import { AlertTriangle, Hammer, Search, ArrowRight, Zap } from 'lucide-react';

interface Props {
  section: AuditSection;
}

const AuditSectionDetails: React.FC<Props> = ({ section }) => {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-3">
            {section.title}
            {section.score < 5 && <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed max-w-3xl border-l-2 border-slate-200 pl-4">
            {section.summary}
          </p>
        </div>
        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl font-bold text-2xl shadow-lg ${
          section.score >= 8 ? 'bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-green-200' :
          section.score >= 5 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-orange-200' :
          'bg-gradient-to-br from-red-400 to-rose-600 text-white shadow-red-200'
        }`}>
          {section.score}
          <span className="text-[10px] font-normal opacity-90">/10</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weaknesses */}
        <div className="bg-red-50 rounded-xl p-6 border border-red-100">
          <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Detected Weaknesses
          </h4>
          <ul className="space-y-3">
            {section.weaknesses.map((weakness, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {weakness}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Hammer className="w-4 h-4" />
            Optimization Strategy
          </h4>
          <div className="space-y-4">
            {section.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200 hover:border-blue-300 transition-colors group/rec shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-slate-900 text-sm group-hover/rec:text-blue-600 transition-colors">{rec.issue}</span>
                  <div className="flex gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                      rec.impact === 'High' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {rec.impact}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      {rec.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="text-slate-600 text-xs mb-3 font-mono bg-slate-50 p-2 rounded border-l-2 border-blue-200">
                  <span className="text-blue-600 mr-2 font-bold">$ fix:</span>
                  {rec.fix}
                </div>

                {rec.keywords && rec.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-100">
                    {rec.keywords.map((kw, kIdx) => (
                      <span key={kIdx} className="text-[10px] text-slate-500 flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                        <Search className="w-3 h-3" /> {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditSectionDetails;