import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Search, 
  FileText, 
  Upload, 
  ChevronRight,
  Brain,
  MessageSquare,
  History,
  Activity,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { Subject, Topic } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type SubjectsViewProps = {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
};

export default function SubjectsView({ subjects, setSubjects, selectedSubjectId, setSelectedSubjectId }: SubjectsViewProps) {
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">
          {selectedSubjectId ? (
            <button 
              onClick={() => setSelectedSubjectId(null)}
              className="flex items-center gap-3 hover:text-[#58a6ff] transition-colors"
            >
              <ChevronRight className="rotate-180" size={28} />
              {selectedSubject?.name}
            </button>
          ) : (
            'My Courses'
          )}
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={16} />
            <input 
              type="text" 
              placeholder="Search subjects..."
              className="pl-10 pr-4 py-2 bg-[#161b22] border border-[#30363d] rounded-xl text-sm text-[#c9d1d9] outline-none w-64 focus:ring-1 focus:ring-[#58a6ff]"
            />
          </div>
          <button className="px-5 py-2 bg-[#58a6ff] text-[#0b0e14] rounded-xl text-sm font-black flex items-center gap-2 hover:bg-[#58a6ff]/90 transition-all shadow-lg shadow-[#58a6ff]/10">
            <Plus size={18} />
            Add Course
          </button>
        </div>
      </div>

      {!selectedSubjectId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <motion.div
              layoutId={subject.id}
              key={subject.id}
              onClick={() => setSelectedSubjectId(subject.id)}
              className="bento-card hover:bg-[#1c2128] cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-inner shadow-black/20" style={{ backgroundColor: subject.color }}>
                  {subject.name.substring(0, 2).toUpperCase()}
                </div>
                <button className="p-2 text-[#8b949e] hover:bg-[#30363d]/50 rounded-lg">
                  <MoreVertical size={20} />
                </button>
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-[#58a6ff] transition-colors mb-2 tracking-tight">{subject.name}</h3>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest mb-2">Progress</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white leading-none">{subject.topics.filter(t => t.status === 'completed').length}</span>
                    <span className="text-[#8b949e] text-sm font-bold">/ {subject.topics.length}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest mb-2">Readiness</p>
                  <span className="text-2xl font-black text-[#58a6ff] leading-none">{subject.readiness}%</span>
                </div>
              </div>
              <div className="mt-5 h-2 w-full bg-[#21262d] rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-[#58a6ff] rounded-full transition-all duration-1000" 
                  style={{ width: `${subject.readiness}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden">
          {/* Topics List */}
          <div className="lg:col-span-3 overflow-y-auto pr-2 space-y-6">
             <section className="bento-card border-[#30363d]/50">
                <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Topic Map</h2>
                    <p className="text-sm text-[#8b949e] mt-1 font-medium">Synchronized from your uploaded notes.</p>
                  </div>
                  <button className="px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-xl text-xs font-bold text-[#c9d1d9] flex items-center gap-2 hover:bg-[#30363d] transition-all">
                    <Upload size={16} />
                    Upload Notes
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedSubject?.topics.map(topic => (
                    <div key={topic.id} className="flex items-center justify-between p-5 bg-[#0b0e14]/50 rounded-2xl border border-[#30363d] group hover:border-[#58a6ff]/50 transition-all">
                       <div className="flex items-center gap-5">
                          <div className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center border",
                            topic.status === 'completed' ? "bg-[#3fb950]/10 text-[#3fb950] border-[#3fb950]/20" :
                            topic.status === 'in-progress' ? "bg-[#58a6ff]/10 text-[#58a6ff] border-[#58a6ff]/20" : "bg-[#21262d] text-[#8b949e] border-[#30363d]"
                          )}>
                             {topic.status === 'completed' ? <CheckCircle2 size={22} /> : <FileText size={22} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#c9d1d9] group-hover:text-white transition-colors">{topic.title}</h4>
                            <div className="flex items-center gap-4 mt-2">
                               <span className={cn(
                                 "badge-bento",
                                 topic.difficulty === 'hard' ? "badge-danger" :
                                 topic.difficulty === 'medium' ? "badge-warning" : "badge-success"
                               )}>
                                 {topic.difficulty}
                               </span>
                               <span className="text-[#8b949e] text-[10px] font-bold uppercase tracking-tight">Last reviewed 2d ago</span>
                            </div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-2.5 text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#161b22] rounded-xl transition-all" title="AI Tutor">
                            <MessageSquare size={18} />
                          </button>
                          <button className="p-2.5 text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#161b22] rounded-xl transition-all" title="Study Topic">
                            <Brain size={18} />
                          </button>
                       </div>
                    </div>
                  ))}
                  <button className="w-full py-5 border-2 border-dashed border-[#30363d] rounded-2xl text-xs font-bold text-[#8b949e] hover:bg-[#161b22] hover:border-[#58a6ff] transition-all flex items-center justify-center gap-2">
                    <Plus size={16} />
                    Add New Topic or Upload Note
                  </button>
                </div>
             </section>
          </div>

          {/* Subject Sidebar */}
          <div className="space-y-6">
             <div className="bento-card">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-widest border-b border-white/5 pb-2">
                  <Activity size={16} className="text-[#58a6ff]" />
                  Subject Stats
                </h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8b949e] font-medium">Exam Date</span>
                    <span className="font-bold text-[#c9d1d9]">{selectedSubject?.examDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8b949e] font-medium">Days Left</span>
                    <span className="font-black text-[#f85149]">24 Days</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8b949e] font-medium">Success Rate</span>
                    <span className="font-black text-[#3fb950]">82%</span>
                  </div>
                </div>
             </div>

             <div className="bento-card bg-gradient-to-br from-[#1e293b] to-[#0b0e14] border-[#58a6ff]/20">
                <h3 className="font-black text-[#58a6ff] mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                  <Brain size={18} />
                  AI Prediction
                </h3>
                <p className="text-[#8b949e] text-xs leading-relaxed mb-6 font-medium">
                  Based on current pace, you'll hit <span className="text-white font-black">95% readiness</span> exactly 2 days before the exam.
                </p>
                <div className="h-2 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
                  <div className="h-full bg-[#58a6ff] w-[78%] rounded-full shadow-[0_0_12px_rgba(88,166,255,0.4)]"></div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

