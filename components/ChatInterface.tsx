import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X } from 'lucide-react';
import { chatWithZaiper } from '../services/gemini';
import { AuditReport, ChatMessage } from '../types';

interface Props {
  report: AuditReport;
  onClose?: () => void;
}

const ChatInterface: React.FC<Props> = ({ report, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Hello! I've analyzed ${report.targetUrl}. I found ${report.sections.reduce((acc, s) => acc + s.weaknesses.length, 0)} issues. Ask me how to fix any of them!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await chatWithZaiper(input, report, messages);
      const botMsg: ChatMessage = { role: 'model', text: responseText || "I couldn't process that.", timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-2xl relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white/90 backdrop-blur flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Optimizer Assistant</h3>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
            </p>
          </div>
        </div>
        {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
            </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-slate-200' : 'bg-blue-100 border border-blue-200'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-slate-600" /> : <Sparkles className="w-4 h-4 text-blue-600" />}
            </div>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-800 border border-slate-200'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-[10px] opacity-70 mt-1 text-right ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
             </div>
             <div className="bg-white rounded-2xl p-3 flex items-center gap-1 border border-slate-200 shadow-sm">
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for code fixes, strategy, or details..."
            className="w-full bg-slate-50 text-slate-900 pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-400 font-medium"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 p-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;