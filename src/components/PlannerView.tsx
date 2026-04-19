import { useState } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import { Subject, Deadline } from '../types';
import { cn } from '../lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

type PlannerViewProps = {
  subjects: Subject[];
  deadlines: Deadline[];
};

export default function PlannerView({ subjects, deadlines }: PlannerViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarDays = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
      {/* Calendar Section */}
      <div className="xl:col-span-3 space-y-6">
        <div className="bento-card bg-[#161b22] border-[#30363d] overflow-hidden">
           <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  {format(currentDate, 'MMMM yyyy')}
                  <span className="badge-bento badge-primary text-[10px] tracking-[0.2em] uppercase px-3">Sync Active</span>
                </h1>
                <p className="text-sm text-[#8b949e] mt-1 font-medium">Coordinate your study blocks with institutional deadlines.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2.5 hover:bg-[#161b22] rounded-xl transition-all text-[#8b949e] border border-transparent hover:border-[#30363d]">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextMonth} className="p-2.5 hover:bg-[#161b22] rounded-xl transition-all text-[#8b949e] border border-transparent hover:border-[#30363d]">
                  <ChevronRight size={20} />
                </button>
              </div>
           </div>

           <div className="grid grid-cols-7 gap-px bg-[#30363d] border border-[#30363d] rounded-2xl overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-[#0b0e14] py-4 text-center text-[10px] font-black uppercase text-[#58a6ff] tracking-[0.2em]">
                  {day}
                </div>
              ))}
              {/* Padding for start of month */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`pad-${i}`} className="bg-[#0b0e14]/50 h-32" />
              ))}
              {calendarDays.map(day => {
                const dayDeadlines = deadlines.filter(d => isSameDay(new Date(d.date), day));
                const isToday = isSameDay(day, new Date());
                return (
                  <div key={day.toString()} className={cn(
                    "bg-[#161b22] h-32 p-3 group hover:bg-[#0b0e14] transition-all relative border-transparent border",
                    isToday && "bg-[#58a6ff]/5"
                  )}>
                    <span className={cn(
                      "text-sm font-black transition-all",
                      isToday ? "text-[#58a6ff] scale-110 origin-left inline-block" : "text-[#8b949e]"
                    )}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-3 space-y-1.5 overflow-hidden">
                       {dayDeadlines.map(d => (
                         <div key={d.id} className="text-[9px] font-black bg-[#58a6ff]/10 text-[#58a6ff] p-2 rounded-lg truncate border border-[#58a6ff]/20 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] shadow-[0_0_5px_rgba(88,166,255,1)]" />
                            {d.title}
                         </div>
                       ))}
                       {day.getDay() === 2 && !dayDeadlines.length && (
                         <div className="text-[9px] font-bold bg-[#3fb950]/10 text-[#3fb950] p-2 rounded-lg border border-[#3fb950]/20 flex items-center gap-1.5">
                            <Clock size={10} />
                            Study Block
                         </div>
                       )}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>

      {/* Task List / Goal Section */}
      <div className="space-y-6">
         <div className="bento-card">
            <h3 className="font-black text-white flex items-center gap-2 mb-8 text-sm uppercase tracking-widest border-b border-white/5 pb-2">
               <Target size={16} className="text-[#d29922]" />
               Daily Roadmap
            </h3>
            <div className="space-y-4">
               {[
                 { label: "Revise DNA Replication", done: true },
                 { label: "Complete Calc Set 5", done: false },
                 { label: "Read Econ Chapter 3", done: false },
               ].map((goal, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[#0b0e14]/50 border border-[#30363d] hover:border-[#58a6ff]/40 transition-all cursor-pointer group">
                    <div className={cn(
                      "w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shadow-inner",
                      goal.done ? "bg-[#3fb950] border-[#3fb950] text-[#0b0e14]" : "border-[#30363d] group-hover:border-[#58a6ff]/50"
                    )}>
                      {goal.done && <CheckCircle2 size={16} />}
                    </div>
                    <span className={cn("text-xs font-bold tracking-tight", goal.done ? "text-[#8b949e] line-through" : "text-[#c9d1d9]")}>
                      {goal.label}
                    </span>
                 </div>
               ))}
            </div>
            <button className="w-full mt-6 py-4 border-2 border-dashed border-[#30363d] rounded-[2rem] text-[10px] font-black uppercase text-[#8b949e] tracking-widest hover:border-[#58a6ff] hover:text-[#58a6ff] transition-all">
              + New Objective
            </button>
         </div>

         <div className="bento-card bg-gradient-to-br from-[#27272a] to-[#09090b] border-[#58a6ff]/20">
            <h3 className="font-black flex items-center gap-2 mb-8 text-white text-sm uppercase tracking-widest border-b border-white/5 pb-2">
               <TrendingUp size={16} className="text-[#58a6ff]" />
               Academic Risk
            </h3>
            <div className="space-y-4">
               <div className="p-5 bg-[#f85149]/5 rounded-2xl border border-[#f85149]/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#f85149]/10 blur-2xl group-hover:bg-[#f85149]/20 transition-all"></div>
                  <div className="flex items-center gap-2 text-[#f85149] mb-3">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Readiness Alert</span>
                  </div>
                  <h4 className="text-sm font-black text-white leading-tight">Advanced Mathematics</h4>
                  <p className="text-[11px] text-[#8b949e] mt-2 font-medium leading-relaxed">
                    You're trailing your target pace by <span className="text-[#f85149] font-black">15%</span> for the mid-term window.
                  </p>
               </div>
               
               <div className="p-5 bg-[#58a6ff]/5 rounded-2xl border border-[#58a6ff]/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#58a6ff]/10 blur-2xl group-hover:bg-[#58a6ff]/20 transition-all"></div>
                  <div className="flex items-center gap-2 text-[#58a6ff] mb-3">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Imminent Milestone</span>
                  </div>
                  <h4 className="text-sm font-black text-white leading-tight">Biology Lab Draft</h4>
                  <p className="text-[11px] text-[#8b949e] mt-2 font-medium leading-relaxed">
                    Personal target window closes in <span className="text-[#58a6ff] font-black">48 hours</span>.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
