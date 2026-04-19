import { useMemo } from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  Calendar,
  AlertCircle,
  Target
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Subject, Deadline } from '../types';
import { cn } from '../lib/utils';

type DashboardViewProps = {
  subjects: Subject[];
  deadlines: Deadline[];
  onViewSubjects: () => void;
  onViewPlanner: () => void;
};

export default function DashboardView({ subjects, deadlines, onViewSubjects, onViewPlanner }: DashboardViewProps) {
  const averageReadiness = Math.round(subjects.reduce((acc, sub) => acc + sub.readiness, 0) / Math.max(subjects.length, 1));
  const masteredCount = subjects.reduce((acc, s) => acc + s.topics.filter(t => t.status === 'completed').length, 0);
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  
  const mostUrgentSubject = [...subjects].sort((a, b) => (a.readiness || 0) - (b.readiness || 0))[0];
  const urgentDeadline = [...deadlines].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const chartData = subjects.map(s => ({ name: s.name, readiness: s.readiness }));

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome & Stats Row */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">{greeting}, Cadet</h1>
          <p className="text-[#8b949e] mt-2 font-medium">Your Local Academic OS is active. Details remain on this device.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex-1 md:flex-initial bento-card flex items-center gap-5 min-w-[200px]">
            <div className="w-14 h-14 rounded-2xl bg-[#3fb950]/10 flex items-center justify-center text-[#3fb950] border border-[#3fb950]/20">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest">Global Readiness</p>
              <p className="text-2xl font-black text-white">{averageReadiness}%</p>
            </div>
          </div>
          <div className="flex-1 md:flex-initial bento-card flex items-center gap-5 min-w-[200px]">
            <div className="w-14 h-14 rounded-2xl bg-[#58a6ff]/10 flex items-center justify-center text-[#58a6ff] border border-[#58a6ff]/20">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest">Concepts Mastered</p>
              <p className="text-2xl font-black text-white">{masteredCount} / {totalTopics || 0}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Hero Card: Focused Prep */}
        <div className="lg:col-span-2 bento-card bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-[#58a6ff]/30 flex flex-col justify-between min-h-[240px]">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#8b949e] uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
              <Target size={14} className="text-[#58a6ff]" />
              Current Focused Prep
            </div>
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-full border-[6px] border-[#3fb950] flex flex-col items-center justify-center shadow-[0_0_20px_rgba(63,185,80,0.2)]">
                <span className="text-2xl font-black text-white Leading-none">{mostUrgentSubject?.readiness || 0}%</span>
                <span className="text-[8px] font-bold uppercase text-[#3fb950]">Ready</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white leading-tight">{mostUrgentSubject?.name || 'No Courses Yet'}</h2>
                <p className="text-[#8b949e] text-sm mt-1">
                  {urgentDeadline ? `${urgentDeadline.title} on ${format(new Date(urgentDeadline.date), 'MMM d')}` : 'No upcoming deadlines'}
                </p>
                <div className="flex gap-2 mt-4">
                  <span className="badge-bento badge-primary">{mostUrgentSubject?.topics.filter(t => t.status === 'completed').length || 0} Units Done</span>
                  <span className="badge-bento badge-danger">{mostUrgentSubject?.topics.filter(t => t.status === 'todo').length || 0} Weak Spots</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Queue Card */}
        <div className="lg:col-span-1 bento-card bg-[#1c2128] border-[#3fb950]/30 shadow-[0_0_20px_rgba(63,185,80,0.05)] flex flex-col justify-between group hover:border-[#3fb950] transition-colors">
          <div>
            <div className="text-[10px] font-bold text-[#3fb950] uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle2 size={14} />
              Quick Actions
            </div>
            <div className="space-y-3">
              <button onClick={onViewSubjects} className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0b0e14] border border-[#30363d] hover:border-[#58a6ff] hover:bg-[#161b22] transition-all group/btn">
                <span className="text-xs font-bold text-[#c9d1d9]">Add New Subject</span>
                <ChevronRight size={14} className="text-[#8b949e] group-hover/btn:text-[#58a6ff]" />
              </button>
              <button onClick={onViewPlanner} className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0b0e14] border border-[#30363d] hover:border-[#58a6ff] hover:bg-[#161b22] transition-all group/btn">
                <span className="text-xs font-bold text-[#c9d1d9]">Set Deadline</span>
                <ChevronRight size={14} className="text-[#8b949e] group-hover/btn:text-[#58a6ff]" />
              </button>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[#30363d]/50">
            <p className="text-[10px] text-[#8b949e] font-medium leading-relaxed italic">
              "Failing to plan is planning to fail."
            </p>
          </div>
        </div>

        {/* Course Overview Quick List */}
        <div className="lg:col-span-1 bento-card space-y-5">
          <div className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest mb-2">Subject Progress</div>
          {(subjects || []).map(s => (
            <div key={s.id} className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-[11px] font-bold text-[#c9d1d9]">{(s.name || 'Subject').split(' ').pop()?.toUpperCase()}</span>
                <span className="text-[11px] font-mono font-bold text-[#8b949e]">{s.readiness || 0}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#21262d] rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full rounded-full transition-all duration-1000" 
                  style={{ 
                    width: `${s.readiness}%`,
                    backgroundColor: s.readiness > 80 ? '#3fb950' : s.readiness > 50 ? '#d29922' : '#f85149'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Chart Card */}
        <div className="lg:col-span-3 bento-card h-[320px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5 w-full">
               <TrendingUp size={18} className="text-[#58a6ff]" />
               Academic Overview
            </h2>
          </div>
          <div className="h-48 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8b949e', fontSize: 10, fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8b949e', fontSize: 10, fontWeight: 600 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  cursor={{ fill: '#30363d', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#161b22', borderRadius: '12px', border: '1px solid #30363d', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', color: '#c9d1d9' }}
                  itemStyle={{ color: '#58a6ff' }}
                />
                <Bar 
                  dataKey="readiness" 
                  fill="#58a6ff" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deadline Center Card */}
        <div className="lg:col-span-1 bento-card flex flex-col">
          <div className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Calendar size={14} />
            Deadline Center
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#0b0e14] border border-[#30363d] rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-[#8b949e] uppercase">Wed</p>
              <p className="text-xl font-black text-white">22</p>
            </div>
            <div className="bg-[#f85149]/10 border border-[#f85149]/30 rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-[#f85149] uppercase">Thu</p>
              <p className="text-xl font-black text-white">23</p>
            </div>
          </div>
          <div className="space-y-3 flex-1">
             {deadlines.slice(0, 2).map((d, i) => (
               <div key={d.id} className="flex items-center gap-3 text-sm font-medium">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? '#58a6ff' : '#f85149' }} />
                 <span className="truncate">{d.title}</span>
               </div>
             ))}
          </div>
          <button onClick={onViewPlanner} className="mt-6 w-full py-3 border border-dashed border-[#30363d] rounded-xl text-xs font-bold text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] transition-all">
            View All +
          </button>
        </div>
      </div>
    </div>
  );
}
