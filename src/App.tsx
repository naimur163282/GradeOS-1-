import { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  BrainCircuit, 
  HelpCircle, 
  User, 
  Settings,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { MOCK_SUBJECTS, MOCK_DEADLINES } from './constants';
import { Subject, Topic, Deadline } from './types';
import DashboardView from './components/DashboardView';
import SubjectsView from './components/SubjectsView';
import PlannerView from './components/PlannerView';
import QuizView from './components/QuizView';
import ReviewView from './components/ReviewView';
import TutorView from './components/TutorView';
import DeveloperView from './components/DeveloperView';

type ViewType = 'dashboard' | 'subjects' | 'planner' | 'quiz' | 'review' | 'tutor' | 'settings' | 'developer';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [deadlines, setDeadlines] = useState<Deadline[]>(MOCK_DEADLINES);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'My Courses', icon: BookOpen },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'quiz', label: 'Auto Quiz', icon: BrainCircuit },
    { id: 'review', label: 'Review Queue', icon: Clock },
    { id: 'tutor', label: 'AI Tutor', icon: HelpCircle },
    { id: 'developer', label: 'Developer', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#0b0e14] overflow-hidden text-[#c9d1d9] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#58a6ff] rounded-xl flex items-center justify-center text-[#0b0e14]">
            <GraduationCap size={22} />
          </div>
          <span className="text-xl font-black tracking-tight text-white uppercase italic">GradeOS</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
                activeView === item.id 
                  ? "bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/30" 
                  : "text-[#8b949e] hover:bg-[#30363d]/30 hover:text-[#c9d1d9]"
              )}
            >
              <item.icon size={18} className={cn(
                "transition-colors",
                activeView === item.id ? "text-[#58a6ff]" : "text-[#8b949e] group-hover:text-[#c9d1d9]"
              )} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-[#30363d]/50">
          <button 
            onClick={() => setActiveView('settings')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#8b949e] hover:bg-[#30363d]/30 hover:text-[#c9d1d9] transition-all",
              activeView === 'settings' && "bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/30"
            )}
          >
            <Settings size={18} />
            Settings
          </button>
          <div className="mt-8 flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#58a6ff] flex items-center justify-center text-[#0b0e14] font-black text-sm">
              NR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Naimur Rashid</p>
              <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider truncate">IBA Executive MBA</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0b0e14]">
        {/* Header */}
        <header className="h-16 bg-[#0b0e14] border-b border-[#30363d]/50 flex items-center justify-between px-10 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={16} />
            <input 
              type="text" 
              placeholder="Search topics, notes, or AI tutor..."
              className="w-full pl-10 pr-4 py-2 bg-[#161b22] border border-[#30363d] rounded-xl text-sm text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:ring-1 focus:ring-[#58a6ff] transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex gap-2 mr-4">
               <span className="badge-bento badge-primary">Beta</span>
               <span className="badge-bento badge-warning">Pro</span>
            </div>
            <button className="p-2 text-[#8b949e] hover:bg-[#161b22] rounded-full transition-all relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#f85149] rounded-full border-2 border-[#0b0e14]"></span>
            </button>
            <button className="px-5 py-2 bg-[#58a6ff] text-[#0b0e14] rounded-xl text-sm font-black hover:bg-[#58a6ff]/90 transition-all flex items-center gap-2 shadow-lg shadow-[#58a6ff]/20">
              <Clock size={16} />
              Study Now
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto h-full"
            >
              {activeView === 'dashboard' && (
                <DashboardView 
                  subjects={subjects} 
                  deadlines={deadlines}
                  onViewSubjects={() => setActiveView('subjects')}
                  onViewPlanner={() => setActiveView('planner')}
                />
              )}
              {activeView === 'subjects' && (
                <SubjectsView 
                  subjects={subjects} 
                  setSubjects={setSubjects}
                  selectedSubjectId={selectedSubjectId}
                  setSelectedSubjectId={setSelectedSubjectId}
                />
              )}
              {activeView === 'planner' && (
                <PlannerView 
                  subjects={subjects} 
                  deadlines={deadlines}
                />
              )}
              {activeView === 'quiz' && (
                <QuizView 
                  subjects={subjects}
                />
              )}
              {activeView === 'review' && (
                <ReviewView 
                  subjects={subjects}
                />
              )}
              {activeView === 'tutor' && (
                <TutorView 
                  subjects={subjects}
                />
              )}
              {activeView === 'developer' && (
                <DeveloperView />
              )}
              {activeView === 'settings' && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Settings size={48} className="mx-auto text-neutral-300 mb-4" />
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <p className="text-neutral-500">Subscription and account management.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
