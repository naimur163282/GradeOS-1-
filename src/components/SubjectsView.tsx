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
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const addCourse = () => {
    if (!newCourseName.trim()) return;
    const newCourse: Subject = {
      id: crypto.randomUUID(),
      name: newCourseName,
      color: ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#bc8cff'][Math.floor(Math.random() * 5)],
      readiness: 0,
      topics: [],
      examDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setSubjects([...subjects, newCourse]);
    setNewCourseName('');
    setIsAddingCourse(false);
  };

  const deleteCourse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSubjects(subjects.filter(s => s.id !== id));
    if (selectedSubjectId === id) setSelectedSubjectId(null);
  };

  const addTopic = () => {
    if (!newTopicTitle.trim() || !selectedSubjectId) return;
    const newTopic: Topic = {
      id: crypto.randomUUID(),
      subjectId: selectedSubjectId,
      title: newTopicTitle,
      difficulty: 'medium',
      status: 'todo',
      spacedRepetitionLevel: 0
    };
    
    setSubjects(subjects.map(s => {
      if (s.id === selectedSubjectId) {
        return { ...s, topics: [...s.topics, newTopic] };
      }
      return s;
    }));
    setNewTopicTitle('');
    setIsAddingTopic(false);
  };

  const toggleTopicStatus = (topicId: string) => {
    setSubjects(subjects.map(s => {
      if (s.id === selectedSubjectId) {
        const newTopics = s.topics.map(t => {
          if (t.id === topicId) {
            const nextStatus = t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'completed' : 'todo';
            return { ...t, status: nextStatus };
          }
          return t;
        });
        const completedCount = newTopics.filter(t => t.status === 'completed').length;
        const readiness = Math.round((completedCount / (newTopics.length || 1)) * 100);
        return { ...s, topics: newTopics, readiness };
      }
      return s;
    }));
  };

  const deleteTopic = (topicId: string) => {
    setSubjects(subjects.map(s => {
      if (s.id === selectedSubjectId) {
        const newTopics = s.topics.filter(t => t.id !== topicId);
        const completedCount = newTopics.filter(t => t.status === 'completed').length;
        const readiness = Math.round((completedCount / (newTopics.length || 1)) * 100);
        return { ...s, topics: newTopics, readiness };
      }
      return s;
    }));
  };

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
          <button 
            onClick={() => setIsAddingCourse(true)}
            className="px-5 py-2 bg-[#58a6ff] text-[#0b0e14] rounded-xl text-sm font-black flex items-center gap-2 hover:bg-[#58a6ff]/90 transition-all shadow-lg shadow-[#58a6ff]/10"
          >
            <Plus size={18} />
            Add Course
          </button>
        </div>
      </div>

      {/* Add Course Modal */}
      <AnimatePresence>
        {isAddingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingCourse(false)}
              className="absolute inset-0 bg-[#0b0e14]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-3xl p-8 z-10 shadow-2xl relative"
            >
              <h2 className="text-2xl font-black text-white mb-6">New Course</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest block mb-2">Course Name</label>
                  <input 
                    autoFocus
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCourse()}
                    placeholder="e.g. Theoretical Physics"
                    className="w-full bg-[#0b0e14] border border-[#30363d] p-4 rounded-xl text-[#c9d1d9] outline-none focus:border-[#58a6ff] transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsAddingCourse(false)}
                    className="flex-1 py-4 rounded-xl text-sm font-bold text-[#8b949e] hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={addCourse}
                    className="flex-1 py-4 bg-[#58a6ff] text-[#0b0e14] rounded-xl text-sm font-black shadow-lg shadow-[#58a6ff]/20"
                  >
                    Create Course
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                <button 
                  onClick={(e) => deleteCourse(subject.id, e)}
                  className="p-2 text-[#8b949e] hover:bg-[#f85149]/10 hover:text-[#f85149] rounded-lg transition-all"
                >
                  <Trash2 size={20} />
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
                    <div key={topic.id} className="flex items-center justify-between p-5 bg-[#0b0e14]/50 rounded-2xl border border-[#30363d] group hover:border-[#58a6ff]/20 transition-all">
                       <div className="flex items-center gap-5">
                          <button 
                            onClick={() => toggleTopicStatus(topic.id)}
                            className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center border transition-all cursor-pointer",
                            topic.status === 'completed' ? "bg-[#3fb950]/20 text-[#3fb950] border-[#3fb950]/40" :
                            topic.status === 'in-progress' ? "bg-[#58a6ff]/20 text-[#58a6ff] border-[#58a6ff]/40" : "bg-[#21262d] text-[#8b949e] border-[#30363d] hover:border-[#8b949e]"
                          )}>
                             {topic.status === 'completed' ? <CheckCircle2 size={22} /> : 
                              topic.status === 'in-progress' ? <Activity size={22} /> : <FileText size={22} />}
                          </button>
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
                               <span className="text-[#8b949e] text-[10px] font-bold uppercase tracking-tight">Status: {topic.status}</span>
                            </div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-2.5 text-[#8b949e] hover:text-[#f85149] hover:bg-[#f85149]/10 rounded-xl transition-all" title="Delete Topic" onClick={() => deleteTopic(topic.id)}>
                            <Trash2 size={18} />
                          </button>
                          <button className="p-2.5 text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#161b22] rounded-xl transition-all" title="AI Tutor">
                            <MessageSquare size={18} />
                          </button>
                       </div>
                    </div>
                  ))}

                  {isAddingTopic ? (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-[#161b22] border border-[#58a6ff] rounded-2xl flex items-center gap-4"
                    >
                      <input 
                        autoFocus
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                        placeholder="Topic title..."
                        className="flex-1 bg-transparent border-none outline-none text-[#c9d1d9] font-bold"
                      />
                      <div className="flex gap-2">
                         <button onClick={() => setIsAddingTopic(false)} className="px-4 py-2 text-xs font-bold text-[#8b949e] hover:text-[#c9d1d9]">Cancel</button>
                         <button onClick={addTopic} className="px-4 py-2 bg-[#58a6ff] text-[#0b0e14] rounded-lg text-xs font-black">Add</button>
                      </div>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={() => setIsAddingTopic(true)}
                      className="w-full py-5 border-2 border-dashed border-[#30363d] rounded-2xl text-xs font-bold text-[#8b949e] hover:bg-[#161b22] hover:border-[#58a6ff] transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Add New Topic
                    </button>
                  )}
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

