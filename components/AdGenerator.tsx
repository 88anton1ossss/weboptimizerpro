import React, { useState } from 'react';
import { GoogleAd } from '../types';
import { generateAdCampaign } from '../services/gemini';
import { Sparkles, Megaphone, Copy, Check, Loader2, MousePointerClick } from 'lucide-react';

interface Props {
  url: string;
  keywords: string[];
}

const AdGenerator: React.FC<Props> = ({ url, keywords }) => {
  const [ads, setAds] = useState<GoogleAd | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateAdCampaign(url, keywords);
      setAds(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
      if (ads) {
          navigator.clipboard.writeText(JSON.stringify(ads, null, 2));
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  return (
    <div className="animate-slideUp space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-blue-600" /> 
                    Google Ads Generator
                </h3>
                <p className="text-slate-500">Create high-CTR headlines and descriptions instantly.</p>
            </div>
            
            <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {ads ? "Regenerate Assets" : "Generate Campaign"}
            </button>
        </div>

        {/* Empty State */}
        {!ads && !loading && (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MousePointerClick className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Ready to Advertise?</h4>
                <p className="text-slate-500 max-w-md mx-auto">Click the button above to have AI generate optimized headlines, descriptions, and keyword targeting strategies for your campaign.</p>
            </div>
        )}

        {/* Loading State */}
        {loading && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium animate-pulse">Analyzing search intent and drafting copy...</p>
            </div>
        )}

        {/* Results */}
        {ads && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                
                {/* Ad Preview */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Search Ad Preview</h4>
                    
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-black text-sm">Ad</span>
                            <span className="text-xs text-slate-600">· {new URL(url).hostname}</span>
                        </div>
                        <div className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer leading-snug">
                            {ads.headlines[0]} | {ads.headlines[1]}
                        </div>
                        <div className="text-[#4d5156] text-sm mt-1 leading-relaxed">
                            {ads.descriptions[0]} {ads.descriptions[1]}
                        </div>
                        {/* Extensions Mockup */}
                        <div className="flex gap-4 mt-2 text-sm text-[#006621]">
                            <span className="hover:underline cursor-pointer">Services</span>
                            <span className="hover:underline cursor-pointer">Contact Us</span>
                            <span className="hover:underline cursor-pointer">Pricing</span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-center mb-3">
                            <h5 className="font-bold text-slate-700 text-sm">Generated Assets</h5>
                            <button onClick={handleCopy} className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1">
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? "Copied" : "Copy JSON"}
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Headlines</span>
                                <div className="flex flex-wrap gap-2">
                                    {ads.headlines.map((h, i) => (
                                        <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700">{h}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Descriptions</span>
                                <div className="space-y-2">
                                    {ads.descriptions.map((d, i) => (
                                        <div key={i} className="px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-700 italic">"{d}"</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Keywords */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-4">Targeting Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                        {ads.keywords.map((k, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white border border-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm">
                                {k}
                            </span>
                        ))}
                    </div>
                    <div className="mt-8">
                        <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2">Campaign Strategy</h4>
                        <ul className="space-y-2 text-sm text-blue-900/70">
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 mt-0.5 shrink-0" /> Use "Phrase Match" for the headlines above to capture intent.
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 mt-0.5 shrink-0" /> A/B test Description 1 vs Description 2 for CTR optimization.
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 mt-0.5 shrink-0" /> Ensure landing page H1 matches the highest performing headline.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        )}
      </div>
    </div>
  );
};

export default AdGenerator;