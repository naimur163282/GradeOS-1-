import { 
  History, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { Subject } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

type ReviewViewProps = {
  subjects: Subject[];
};

export default function ReviewView({ subjects }: ReviewViewProps) {
  const reviewQueue = subjects.flatMap(s => 
    s.topics.filter(t => t.status !== 'completed').map(t => ({
      id: t.id,
      title: t.title,
      subject: s.name,
      diff: t.difficulty,
      due: 'Today'
    }))
  ).slice(0, 10);

  const pendingCount = subjects.reduce((acc, s) => acc + s.topics.filter(t => t.status !== 'completed').length, 0);
  const masteredCount = subjects.reduce((acc, s) => acc + s.topics.filter(t => t.status === 'completed').length, 0);
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const retentionRate = totalTopics > 0 ? Math.round((masteredCount / totalTopics) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <div className="flex items-center justify-between mb-2">
         <div>
           <h1 className="text-4xl font-black text-white flex items-center gap-4 tracking-tight">
             <Clock className="text-[#58a6ff]" size={40} />
             Knowledge Review Queue
           </h1>
           <p className="text-[#8b949e] mt-2 font-medium">Neural-optimized review window (SM-2 Algorithm).</p>
         </div>
          <span className="badge-bento badge-primary text-xs uppercase tracking-[0.2em] px-5 py-2">{pendingCount} PENDING</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bento-card flex flex-col justify-between h-[180px]">
            <p className="text-[10px] text-[#8b949e] font-black uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">Daily Quota Index</p>
            <div className="flex items-baseline gap-3">
               <span className="text-5xl font-black text-white">{masteredCount}</span>
               <span className="text-[#8b949e] font-bold text-xl">/ {totalTopics}</span>
            </div>
            <div className="mt-6 h-2 w-full bg-[#161b22] rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-[#58a6ff] rounded-full shadow-[0_0_12px_rgba(88,166,255,0.4)] transition-all"
                style={{ width: `${totalTopics > 0 ? (masteredCount / totalTopics) * 100 : 0}%` }}
              ></div>
            </div>
         </div>
         <div className="bento-card bg-gradient-to-br from-[#1c1917] to-[#0c0a09] border-[#d29922]/30 flex flex-col justify-between h-[180px]">
            <p className="text-[10px] text-[#d29922] font-black uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">Active Retention</p>
            <span className="text-5xl font-black text-white">{retentionRate}%</span>
            <p className="text-[10px] text-[#d29922] font-bold mt-2 flex items-center gap-2 uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse" />
              {retentionRate > 80 ? 'TOP 5% IN BATCH' : 'OPTIMIZING NEURAL PATH'}
            </p>
         </div>
         <div className="bento-card border-dashed border-[#30363d] flex items-center justify-center h-[180px] bg-transparent">
            <p className="text-center text-xs font-bold text-[#8b949e] leading-relaxed italic opacity-60">
              "Your recall probability remains the highest when intervals are strictly maintained."
            </p>
         </div>
      </div>

      <section className="bento-card border-[#30363d]/50 p-0 overflow-hidden shadow-2xl">
         <div className="px-8 py-6 border-b border-[#30363d] bg-[#161b22]/50 flex items-center justify-between">
            <h2 className="font-black text-white text-sm uppercase tracking-widest flex items-center gap-3">
              <History size={18} className="text-[#8b949e]" />
              Sequenced Knowledge Map
            </h2>
            <div className="flex gap-2">
               <span className="badge-bento badge-danger">High Priority</span>
            </div>
         </div>
         <div className="divide-y divide-[#30363d]/50">
            {reviewQueue.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="px-8 py-8 flex items-center justify-between group hover:bg-[#161b22] transition-all cursor-pointer border-l-4 border-transparent hover:border-[#58a6ff]"
              >
                 <div className="flex items-center gap-8">
                    <div className="shrink-0 flex items-center justify-center">
                       <div className={cn(
                         "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all",
                         item.diff === 'hard' ? "bg-[#f85149]/10 text-[#f85149] border-[#f85149]/20 shadow-[0_0_10px_rgba(248,81,73,0.1)]" :
                         item.diff === 'medium' ? "bg-[#d29922]/10 text-[#d29922] border-[#d29922]/20" :
                         "bg-[#3fb950]/10 text-[#3fb950] border-[#3fb950]/20"
                       )}>
                         <GraduationCap size={28} />
                       </div>
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-white group-hover:text-[#58a6ff] transition-colors tracking-tight">{item.title}</h3>
                       <p className="text-xs text-[#8b949e] mt-1.5 font-bold uppercase tracking-wider flex items-center gap-2">
                         {item.subject} 
                         <span className="w-1 h-1 rounded-full bg-[#30363d]" />
                         <span className={cn(
                           "font-black tracking-widest",
                           item.diff === 'hard' ? "text-[#f85149]" :
                           item.diff === 'medium' ? "text-[#d29922]" :
                           "text-[#3fb950]"
                         )}>{item.diff.toUpperCase()}</span>
                       </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-10">
                    <div className="text-right flex flex-col items-end">
                       <p className="text-[10px] text-[#8b949e] font-black uppercase tracking-[0.2em] mb-2">Window Opens</p>
                       <span className={cn(
                         "text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border",
                         item.due === 'Today' ? "bg-[#f85149]/10 text-[#f85149] border-[#f85149]/20" : "bg-[#161b22] text-[#8b949e] border-[#30363d]"
                       )}>{item.due}</span>
                    </div>
                    <button className="w-12 h-12 rounded-[1.25rem] bg-[#161b22] border border-[#30363d] text-[#8b949e] group-hover:bg-[#58a6ff] group-hover:text-[#0b0e14] group-hover:border-[#58a6ff] transition-all flex items-center justify-center shadow-lg">
                       <ArrowRight size={24} />
                    </button>
                 </div>
              </motion.div>
            ))}
         </div>
         <div className="p-10 bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-center border-t border-[#30363d]">
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase italic opacity-20 text-[10px] tracking-[0.5em] mb-4">Neural Accelerator Active</h3>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">System Ready for Batch Optimization</h3>
            <p className="text-[#8b949e] text-sm mb-10 font-medium max-w-lg mx-auto leading-relaxed">Mastering these {pendingCount} topics will push your GradeOS global readiness index to <span className="text-[#3fb950] font-black">100%</span>.</p>
            <button className="px-12 py-5 bg-[#58a6ff] text-[#0b0e14] rounded-[2rem] font-black text-xl hover:shadow-2xl hover:shadow-[#58a6ff]/20 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto shadow-xl shadow-[#58a6ff]/10">
               Start Smart Session
               <ArrowRight size={24} />
            </button>
         </div>
      </section>
    </div>
  );
 }
