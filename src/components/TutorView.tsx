import { useState, useEffect } from 'react';
import { 
  Send, 
  HelpCircle, 
  ChevronRight, 
  Brain, 
  History,
  GraduationCap,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Subject } from '../types';
import { geminiService } from '../services/gemini';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type TutorViewProps = {
  subjects: Subject[];
};

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function TutorView({ subjects }: TutorViewProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(subjects.length > 0 ? subjects[0] : null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedSubject && messages.length === 0) {
      setMessages([{ role: 'model', content: `Hi! I'm your GradeOS AI Tutor. How can I help you with **${selectedSubject.name}** today?` }]);
    }
  }, [selectedSubject, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !selectedSubject) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.askTutor(selectedSubject.name, input, messages);
      setMessages(prev => [...prev, { role: 'model', content: response || "I'm sorry, I couldn't process that request." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: "An error occurred. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex bg-[#161b22] rounded-3xl border border-[#30363d] overflow-hidden shadow-2xl">
      {/* Subject Selector Sidebar */}
      <div className="w-80 border-r border-[#30363d]/50 flex flex-col bg-[#0b0e14]/50">
        <div className="p-8 border-b border-[#30363d]/50">
           <h2 className="font-black text-white text-sm uppercase tracking-widest flex items-center gap-2">
             <History size={16} className="text-[#8b949e]" />
             Past Sessions
           </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           {subjects.map(s => (
             <button
               key={s.id}
               onClick={() => setSelectedSubject(s)}
               className={cn(
                 "w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center justify-between group border",
                 selectedSubject?.id === s.id 
                  ? "bg-[#58a6ff]/10 text-[#58a6ff] border-[#58a6ff]/30 shadow-lg shadow-[#58a6ff]/5" 
                  : "hover:bg-[#161b22] text-[#8b949e] border-transparent"
               )}
             >
               <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: s.color }} />
                  <span className="text-sm font-bold truncate max-w-[120px]">{s.name}</span>
               </div>
               {selectedSubject?.id === s.id && <Sparkles size={14} className="text-[#58a6ff] animate-pulse" />}
             </button>
           ))}
        </div>
        <div className="p-8 bg-[#0b0e14] border-t border-[#30363d]/50">
           <div className="bento-card p-4 border-[#30363d]/50">
              <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest mb-3">Study Streak</p>
              <div className="flex gap-1.5">
                {[1,1,1,1,0,0,0].map((d, i) => (
                  <div key={i} className={cn("flex-1 h-7 rounded-lg transition-all", d ? "bg-[#58a6ff]" : "bg-[#21262d]")} />
                ))}
              </div>
              <p className="text-sm text-white font-black mt-3">4 Day Streak!</p>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative bg-[#161b22]">
        {/* Header */}
        <div className="p-8 border-b border-[#30363d]/50 flex items-center justify-between bg-[#161b22] shrink-0">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 rounded-2xl bg-[#58a6ff] flex items-center justify-center text-[#0b0e14] shadow-lg shadow-[#58a6ff]/20">
               <Brain size={28} />
             </div>
             <div>
               <h3 className="font-black text-white text-lg tracking-tight">{selectedSubject?.name || 'Academic'} AI Tutor</h3>
               <p className="text-xs text-[#3fb950] font-bold flex items-center gap-1.5">
                 <span className="w-2 h-2 bg-[#3fb950] rounded-full animate-pulse"></span>
                 Online • Context Synchronized
               </p>
             </div>
          </div>
          <button className="px-5 py-2.5 text-xs font-bold text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d] rounded-xl transition-all uppercase tracking-widest"> 
            Re-sync Context 
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-[#0b0e14]/20 custom-scrollbar">
          {messages.map((msg, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={cn(
                "flex max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-1 shadow-lg",
                msg.role === 'user' ? "ml-4 bg-[#30363d] text-[#c9d1d9]" : "mr-4 bg-[#58a6ff] text-[#0b0e14]"
              )}>
                {msg.role === 'user' ? <GraduationCap size={20} /> : <Brain size={20} />}
              </div>
              <div className={cn(
                "p-5 rounded-[2rem] text-sm leading-relaxed font-medium",
                msg.role === 'user' 
                  ? "bg-[#1f2937] text-[#c9d1d9] rounded-tr-none border border-[#374151] shadow-xl" 
                  : "bg-[#161b22] text-[#c9d1d9] border border-[#30363d] rounded-tl-none shadow-lg"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex mr-auto max-w-[85%]">
              <div className="w-10 h-10 rounded-2xl bg-[#58a6ff] text-[#0b0e14] flex items-center justify-center shrink-0 mr-4 animate-pulse">
                <Brain size={20} />
              </div>
              <div className="bg-[#161b22] px-6 py-5 rounded-[2rem] rounded-tl-none border border-[#30363d] shadow-lg flex items-center gap-3">
                <Loader2 size={18} className="animate-spin text-[#58a6ff]" />
                <span className="text-sm text-[#8b949e] font-bold italic tracking-wide uppercase text-[10px]">Processing Knowledge...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-8 bg-[#161b22] border-t border-[#30363d]/50 shrink-0">
           <div className="relative group max-w-4xl mx-auto">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything about your notes..."
                className="w-full pl-8 pr-20 py-5 bg-[#0b0e14] border border-[#30363d] rounded-[2rem] text-sm text-[#c9d1d9] placeholder-[#8b949e] focus:bg-[#0b0e14] focus:ring-2 focus:ring-[#58a6ff]/20 focus:border-[#58a6ff] outline-none transition-all resize-none max-h-32 shadow-inner"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                  input.trim() ? "bg-[#58a6ff] text-[#0b0e14] shadow-xl shadow-[#58a6ff]/20" : "bg-[#21262d] text-[#8b949e]"
                )}
              >
                <Send size={22} />
              </button>
           </div>
           <p className="text-[10px] text-center text-[#8b949e] mt-6 uppercase font-black tracking-[0.2em] opacity-50">
             Advanced Academic AI • No Data Drift
           </p>
        </div>
      </div>
    </div>
  );
}
