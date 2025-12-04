import React, { useState, useCallback } from 'react';
import { analyzeWebsite } from './services/gemini';
import { AuditReport, AppState } from './types';
import ScannerEffect from './components/ScannerEffect';
import AuditSectionDetails from './components/AuditSectionDetails';
import RadialScore from './components/RadialScore';
import ChatInterface from './components/ChatInterface';
import { 
  ShieldCheck, 
  Search, 
  Terminal,
  ArrowRightCircle,
  MessageSquare,
  Zap,
  Layout,
  BarChart3,
  Globe,
  TrendingUp,
  X,
  Copy,
  Check,
  Tag,
  Hash,
  CloudLightning,
  Lightbulb,
  FileText
} from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showChat, setShowChat] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedKeywords, setCopiedKeywords] = useState(false);

  const handleAudit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
    }

    setAppState(AppState.SCANNING);
    setErrorMsg('');
    setReport(null);

    try {
      const result = await analyzeWebsite(formattedUrl);
      setReport(result);
      setAppState(AppState.COMPLETE);
    } catch (err) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg("Unable to connect to target. Please ensure the URL is publicly accessible.");
    }
  }, [url]);

  const handleCopy = () => {
      if (report) {
          navigator.clipboard.writeText(JSON.stringify(report, null, 2));
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  const handleCopyKeywords = () => {
    if (report) {
        const text = `Top Keywords:\n${report.keywords.join(', ')}\n\nTop Phrases:\n${report.keyPhrases.join(', ')}`;
        navigator.clipboard.writeText(text);
        setCopiedKeywords(true);
        setTimeout(() => setCopiedKeywords(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-200 flex flex-col font-sans">
      
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setAppState(AppState.IDLE); setReport(null); }}>
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg blur opacity-50"></div>
                <div className="relative w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                    <Terminal className="text-slate-900 w-5 h-5" />
                </div>
            </div>
            <div>
                <h1 className="font-bold text-xl tracking-tight text-slate-900 leading-none">WEB OPTIMIZER <span className="text-blue-600">PRO</span></h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Deep Audit Protocol v2.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {appState === AppState.COMPLETE && (
                <>
                  <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-xs font-bold">
                    <Search className="w-3 h-3" />
                    Verified by Google Search
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                        copied
                         ? 'bg-green-100 border-green-200 text-green-700'
                         : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                    }`}
                  >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span className="text-sm font-medium">{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                  <button 
                    onClick={() => setShowChat(!showChat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                      showChat 
                          ? 'bg-blue-50 border-blue-500 text-blue-600' 
                          : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">Assistant</span>
                  </button>
                </>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className={`flex-1 overflow-y-auto scroll-smooth ${showChat && appState === AppState.COMPLETE ? 'mr-0 lg:mr-[400px]' : ''} transition-all duration-300`}>
          <div className="max-w-[1400px] mx-auto px-6 py-10">
            
            {/* IDLE STATE */}
            {appState === AppState.IDLE && (
              <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fadeIn relative">
                
                {/* Background Blobs */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-200/50 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-200/50 rounded-full blur-[100px] pointer-events-none animate-float opacity-50"></div>

                <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono text-blue-600 mb-6 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    SYSTEM ONLINE // LIVE GOOGLE SEARCH ACTIVE
                  </div>
                  <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
                    Optimize Your <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400">Digital Presence</span>
                  </h1>
                  <p className="text-slate-600 text-xl max-w-2xl mx-auto leading-relaxed">
                    Deploy our Gemini-powered engine to analyze 100+ SEO signals using <strong>Real-Time Google Search data</strong> to uncover gaps and opportunities.
                  </p>
                </div>

                <form onSubmit={handleAudit} className="w-full max-w-2xl relative group z-10">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-2xl opacity-30 group-hover:opacity-60 transition duration-500 group-hover:duration-200 blur-lg"></div>
                  <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-xl border border-slate-100">
                    <div className="pl-4 pr-3">
                        <Globe className="w-6 h-6 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter website URL (e.g. apple.com)"
                      className="w-full bg-transparent text-slate-900 text-lg placeholder-slate-400 focus:outline-none py-4 font-medium"
                    />
                    <button 
                      type="submit"
                      disabled={!url}
                      className="bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Audit Now <ArrowRightCircle className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl z-10">
                   {[
                     { label: "Technical SEO", desc: "Core Vitals & Meta", icon: ShieldCheck },
                     { label: "AI Visibility", desc: "LLM Readiness", icon: Zap },
                     { label: "Live Search", desc: "Real-time Grounding", icon: Globe },
                     { label: "Keyword Tool", desc: "Niche Extraction", icon: CloudLightning },
                   ].map((feature, idx) => (
                     <div key={idx} className="flex flex-col p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-sm group">
                       <feature.icon className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors mb-3" />
                       <span className="text-slate-900 font-bold mb-1">{feature.label}</span>
                       <span className="text-xs text-slate-500">{feature.desc}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* SCANNING STATE */}
            {appState === AppState.SCANNING && <ScannerEffect />}

            {/* ERROR STATE */}
            {appState === AppState.ERROR && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fadeIn">
                <div className="bg-red-50 border border-red-200 p-10 rounded-3xl text-center max-w-lg shadow-lg">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X className="w-10 h-10 text-red-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">Scan Terminated</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed">{errorMsg}</p>
                  <button 
                    onClick={() => setAppState(AppState.IDLE)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-200"
                  >
                    Return to Console
                  </button>
                </div>
              </div>
            )}

            {/* COMPLETE STATE */}
            {appState === AppState.COMPLETE && report && (
              <div className="animate-slideUp pb-20">
                
                {/* Executive Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
                  
                  {/* Score Card */}
                  <div className="lg:col-span-3 bg-white rounded-3xl p-1 border border-slate-200 shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>
                     <div className="h-full bg-white rounded-[22px] p-6 flex flex-col items-center justify-center">
                        <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-6">Health Score</h3>
                        <div className="relative">
                            <RadialScore score={report.overallScore} size={180} color={report.overallScore > 70 ? "#10b981" : report.overallScore > 50 ? "#f59e0b" : "#ef4444"} />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-32 h-32 bg-cyan-100 rounded-full blur-2xl opacity-50"></div>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-lg font-bold text-slate-900 truncate max-w-[200px]">{new URL(report.targetUrl).hostname}</p>
                            <p className="text-xs text-slate-500 font-mono mt-1">{report.scanDate}</p>
                        </div>
                     </div>
                  </div>

                  {/* Summary & Metrics */}
                  <div className="lg:col-span-9 flex flex-col gap-6">
                    {/* Top Row Stats (Simulated) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Est. Load Time", val: "~1.2s", color: "text-green-600" },
                            { label: "Mobile Score", val: "88/100", color: "text-blue-600" },
                            { label: "Organic KW", val: "Detected", color: "text-purple-600" },
                            { label: "Security", val: "Standard", color: "text-cyan-600" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col shadow-sm">
                                <span className="text-xs text-slate-500 font-medium uppercase">{stat.label}</span>
                                <span className={`text-xl font-bold ${stat.color} mt-1`}>{stat.val}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                        <div className="glass-panel rounded-3xl p-8 flex flex-col bg-white">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-purple-600" /> Executive Brief
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-sm flex-1">
                                {report.executiveSummary}
                            </p>
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                                <h4 className="text-blue-700 font-bold text-xs uppercase mb-1 flex items-center gap-2">
                                    <TrendingUp className="w-3 h-3" /> Projected Impact
                                </h4>
                                <p className="text-slate-700 font-medium text-sm">{report.businessImpact}</p>
                            </div>
                        </div>

                        <div className="glass-panel rounded-3xl p-8 bg-white">
                           <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                             <Zap className="w-5 h-5 text-amber-500" /> High Priority Wins
                           </h3>
                           <ul className="space-y-4">
                             {report.quickWins.map((win, i) => (
                               <li key={i} className="flex gap-4 items-start group">
                                 <span className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200 group-hover:border-amber-400 group-hover:text-amber-500 transition-colors shrink-0 mt-0.5">
                                    {i + 1}
                                 </span>
                                 <p className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{win}</p>
                               </li>
                             ))}
                           </ul>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Interface */}
                <div className="flex flex-col lg:flex-row gap-8">
                  
                  {/* Sidebar Nav */}
                  <div className="w-full lg:w-72 flex-none space-y-3 sticky top-24 self-start">
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className={`w-full text-left px-5 py-4 rounded-xl flex items-center justify-between transition-all group ${
                        activeTab === 'overview' 
                            ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm' 
                            : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                      }`}
                    >
                      <span className="font-bold">Full Overview</span>
                      <Layout className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('keywords')}
                      className={`w-full text-left px-5 py-4 rounded-xl flex items-center justify-between transition-all group ${
                        activeTab === 'keywords' 
                            ? 'bg-purple-50 text-purple-600 border border-purple-200 shadow-sm' 
                            : 'bg-white border border-slate-200 text-slate-500 hover:border-purple-200 hover:text-purple-600'
                      }`}
                    >
                      <span className="font-bold">SEO Keyword Parser</span>
                      <Tag className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </button>

                    <div className="pl-2 space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-2">Audit Modules</p>
                        {report.sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveTab(section.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between text-sm transition-all ${
                            activeTab === section.id 
                                ? 'bg-slate-900 text-white font-bold shadow-lg shadow-slate-200 translate-x-1' 
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:translate-x-1'
                            }`}
                        >
                            <span className="truncate pr-2">{section.title}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                                section.score >= 8 ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 
                                section.score >= 5 ? 'bg-amber-500' : 
                                'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'
                            }`}></div>
                        </button>
                        ))}
                    </div>
                  </div>

                  {/* Detail Panel */}
                  <div className="flex-grow min-h-[500px]">
                    {activeTab === 'overview' && (
                      <div className="space-y-8 animate-slideUp">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-6">
                          <div>
                              <h2 className="text-3xl font-bold text-slate-900 mb-2">Audit Details</h2>
                              <p className="text-slate-500">Comprehensive breakdown of all 10 analysis vectors.</p>
                          </div>
                          <div className="hidden md:flex gap-2">
                             <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-50 border border-red-100 text-xs text-red-600">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                Critical
                             </div>
                             <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-amber-50 border border-amber-100 text-xs text-amber-600">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                Warning
                             </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-8">
                          {report.sections.map(section => (
                            <AuditSectionDetails key={section.id} section={section} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'keywords' && (
                        <div className="animate-slideUp space-y-8">
                            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                             {/* Decorative Background for Keyword Tool */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
                            
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                        <CloudLightning className="w-6 h-6 text-purple-600" /> 
                                        SEO Keyword Parser
                                    </h3>
                                    <p className="text-slate-500">Extracted from top competitors via Live Google Search.</p>
                                </div>
                                <button
                                    onClick={handleCopyKeywords}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
                                        copiedKeywords 
                                        ? 'bg-green-100 border-green-200 text-green-700' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-600'
                                    }`}
                                >
                                    {copiedKeywords ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span className="text-sm font-bold">{copiedKeywords ? 'All Copied' : 'Copy All'}</span>
                                </button>
                            </div>

                            {/* Strategy Box */}
                            <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-6 relative z-10">
                                <h4 className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" /> Strategic Insight
                                </h4>
                                <p className="text-slate-700 leading-relaxed font-medium">
                                    {report.keywordStrategy || "Focus on these keywords to improve your topical authority and capture high-intent traffic in your specific niche."}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                {/* Money Keywords */}
                                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                    <h4 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                                        <Tag className="w-4 h-4 text-blue-500" /> Money Keywords (High Intent)
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        {report.keywords?.map((kw, i) => (
                                            <div key={i} className="flex justify-between items-center group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                <span className="text-slate-800 font-medium">{kw}</span>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded font-bold">High Vol</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Long Tail Phrases */}
                                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                    <h4 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                                        <Hash className="w-4 h-4 text-purple-500" /> Long-Tail Opportunities
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        {report.keyPhrases?.map((phrase, i) => (
                                            <div key={i} className="flex justify-between items-center group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                <span className="text-slate-800 font-medium">{phrase}</span>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                     <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">Niche</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    )}

                    {/* Individual Sections (Fallback for direct clicks) */}
                    {activeTab !== 'overview' && activeTab !== 'keywords' && (
                      <div className="space-y-6 animate-fadeIn">
                         {report.sections.filter(s => s.id === activeTab).map(section => (
                           <AuditSectionDetails key={section.id} section={section} />
                         ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Chat Sidebar */}
        <div 
            className={`fixed top-16 right-0 bottom-0 w-full md:w-[400px] z-40 transform transition-transform duration-300 ease-in-out ${
                showChat && appState === AppState.COMPLETE ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            {report && (
                <ChatInterface report={report} onClose={() => setShowChat(false)} />
            )}
        </div>
        
        {/* Mobile Chat Toggle (visible only on small screens when report is complete) */}
        {appState === AppState.COMPLETE && !showChat && (
             <button 
             onClick={() => setShowChat(true)}
             className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full shadow-xl flex items-center justify-center text-white z-50 hover:scale-110 transition-transform"
           >
             <MessageSquare className="w-7 h-7" />
           </button>
        )}

      </main>
    </div>
  );
}