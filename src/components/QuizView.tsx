import { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Trophy,
  History
} from 'lucide-react';
import { Subject, QuizQuestion } from '../types';
import { geminiService } from '../services/gemini';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type QuizViewProps = {
  subjects: Subject[];
};

export default function QuizView({ subjects }: QuizViewProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState<'setup' | 'quiz' | 'result'>('setup');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const startQuiz = async () => {
    if (!selectedSubject || !topic.trim()) return;
    setIsLoading(true);
    try {
      const q = await geminiService.generateQuiz(selectedSubject.name, topic, "User syllabus notes on " + topic);
      setQuestions(q);
      setCurrentStep('quiz');
      setCurrentIndex(0);
      setScore(0);
    } catch (e) {
      alert("Failed to generate quiz. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCurrentStep('result');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pt-8">
      <AnimatePresence mode="wait">
        {currentStep === 'setup' && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
               <div className="w-24 h-24 bg-[#58a6ff]/10 rounded-[2.5rem] flex items-center justify-center text-[#58a6ff] mx-auto mb-8 border border-[#58a6ff]/20 shadow-lg shadow-[#58a6ff]/5">
                 <BrainCircuit size={48} />
               </div>
               <h1 className="text-4xl font-black text-white tracking-tight">AI Quiz Generator</h1>
               <p className="text-[#8b949e] mt-2 text-lg font-medium">Turn your syllabus into instant adaptive knowledge checks.</p>
            </div>

            <div className="bento-card border-[#30363d] space-y-10 p-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em] pl-1">Select Domain</label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSubject(s)}
                        className={cn(
                          "px-5 py-4 rounded-2xl text-sm font-black border transition-all flex items-center gap-3",
                          selectedSubject?.id === s.id 
                            ? "bg-[#58a6ff]/10 text-[#58a6ff] border-[#58a6ff]/40 shadow-xl shadow-[#58a6ff]/5" 
                            : "bg-[#0b0e14] text-[#8b949e] border-[#30363d] hover:border-[#58a6ff]/40"
                        )}
                      >
                        <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: s.color }} />
                        {s.name}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em] pl-1">Knowledge focus</label>
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Molecular DNA Replication"
                    className="w-full px-8 py-5 bg-[#0b0e14] border border-[#30363d] rounded-2xl focus:bg-[#0b0e14] focus:ring-4 focus:ring-[#58a6ff]/10 focus:border-[#58a6ff] outline-none transition-all font-bold text-[#c9d1d9] placeholder-[#30363d]"
                  />
               </div>

               <button 
                onClick={startQuiz}
                disabled={!selectedSubject || !topic.trim() || isLoading}
                className="w-full py-6 bg-[#58a6ff] text-[#0b0e14] rounded-[2rem] font-black text-xl hover:shadow-2xl hover:shadow-[#58a6ff]/20 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-[#58a6ff]/10"
               >
                 {isLoading ? (
                   <>
                     <Loader2 className="animate-spin" size={24} />
                     Optimizing Neural Path...
                   </>
                 ) : (
                   <>
                     Generate adaptive session
                     <Sparkles size={24} className="group-hover:scale-125 transition-all text-[#0b0e14]/50" />
                   </>
                 )}
               </button>
            </div>

            <div className="flex items-center gap-6 bg-[#161b22]/50 p-8 rounded-[2.5rem] border border-[#30363d]/50 border-dashed">
               <History size={32} className="text-[#8b949e]" />
               <div className="flex-1">
                 <h4 className="font-black text-white text-sm uppercase tracking-widest">Recent Performance</h4>
                 <p className="text-xs text-[#8b949e] mt-1 font-medium">You scored <span className="text-[#3fb950] font-black">85%</span> on Complex Numbers yesterday.</p>
               </div>
               <button className="text-[#58a6ff] font-black text-xs uppercase tracking-[0.1em] px-4 py-2 border border-[#58a6ff]/30 rounded-xl hover:bg-[#58a6ff]/10 transition-all">Review</button>
            </div>
          </motion.div>
        )}

        {currentStep === 'quiz' && questions.length > 0 && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
             <div className="flex items-center justify-between mb-10 bg-[#161b22] px-8 py-6 rounded-[2rem] border border-[#30363d]">
                <div className="flex-1">
                   <div className="h-2 w-full bg-[#30363d] rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-[#58a6ff] shadow-[0_0_10px_rgba(88,166,255,0.4)]" 
                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                      />
                   </div>
                   <div className="flex justify-between mt-3">
                     <span className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Step {currentIndex + 1} of {questions.length}</span>
                     <span className="text-[10px] font-black text-[#3fb950] uppercase tracking-widest">Score: {score}</span>
                   </div>
                </div>
             </div>

             <div className="bento-card p-12 lg:p-16 min-h-[480px] flex flex-col justify-center border-[#30363d]/50">
                <h2 className="text-3xl font-black text-white mb-16 leading-tight tracking-tight text-center lg:text-left">
                  {questions[currentIndex].question}
                </h2>

                <div className="grid grid-cols-1 gap-5">
                   {questions[currentIndex].options.map((opt, i) => {
                     const isCorrect = i === questions[currentIndex].correctAnswer;
                     const isSelected = i === selectedOption;
                     return (
                       <button
                         key={i}
                         onClick={() => handleOptionSelect(i)}
                         disabled={isAnswered}
                         className={cn(
                           "p-8 rounded-[2rem] text-left font-bold transition-all flex items-center justify-between group border",
                           !isAnswered && "bg-[#0b0e14] text-[#c9d1d9] border-[#30363d] hover:bg-[#161b22] hover:border-[#58a6ff]/40 hover:-translate-y-1",
                           isAnswered && isCorrect && "bg-[#3fb950] text-[#0b0e14] border-[#3fb950] shadow-2xl shadow-[#3fb950]/20",
                           isAnswered && isSelected && !isCorrect && "bg-[#f85149] text-[#0b0e14] border-[#f85149] shadow-2xl shadow-[#f85149]/20",
                           isAnswered && !isCorrect && !isSelected && "opacity-30 grayscale bg-[#0b0e14] border-[#30363d]"
                         )}
                       >
                         <span className="text-lg tracking-tight">{opt}</span>
                         {isAnswered && isCorrect && <CheckCircle2 size={32} />}
                         {isAnswered && isSelected && !isCorrect && <XCircle size={32} />}
                       </button>
                     );
                   })}
                </div>

                <AnimatePresence>
                  {isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 p-8 bg-[#58a6ff]/5 rounded-[2rem] border border-[#58a6ff]/20 shadow-inner"
                    >
                      <p className="text-[10px] font-black text-[#58a6ff] mb-3 flex items-center gap-2 uppercase tracking-[0.2em]">
                        <Sparkles size={14} />
                        Synaptic Insight
                      </p>
                      <p className="text-sm text-[#c9d1d9] leading-relaxed font-bold italic">
                        {questions[currentIndex].explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             <div className="flex justify-end pt-4">
                <button 
                  onClick={nextQuestion}
                  disabled={!isAnswered}
                  className="px-10 py-5 bg-white text-[#0b0e14] rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-[#58a6ff] hover:text-[#0b0e14] transition-all disabled:opacity-0 shadow-2xl shadow-white/5"
                >
                  {currentIndex === questions.length - 1 ? 'End Session' : 'Continue Path'}
                  <ArrowRight size={20} />
                </button>
             </div>
          </motion.div>
        )}

        {currentStep === 'result' && (
           <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bento-card p-16 border-[#30363d]"
          >
             <div className="w-28 h-28 bg-[#d29922]/10 rounded-[3rem] border border-[#d29922]/30 flex items-center justify-center text-[#d29922] mx-auto mb-10 shadow-2xl shadow-[#d29922]/10 ring-4 ring-[#d29922]/5">
               <Trophy size={56} />
             </div>
             <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Session Optimized</h2>
             <p className="text-[#8b949e] text-xl mb-12 font-medium tracking-tight">You successfully integrated {score} out of {questions.length} concepts into long-term memory.</p>
             
             <div className="grid grid-cols-2 gap-6 mb-16 max-w-sm mx-auto">
                <div className="p-6 bg-[#0b0e14] rounded-[2rem] border border-[#30363d] shadow-inner">
                  <p className="text-[10px] text-[#8b949e] font-black uppercase tracking-widest mb-2">Mastery Index</p>
                  <p className="text-4xl font-black text-white">{Math.round((score / questions.length) * 100)}%</p>
                </div>
                <div className="p-6 bg-[#0b0e14] rounded-[2rem] border border-[#30363d] shadow-inner">
                  <p className="text-[10px] text-[#8b949e] font-black uppercase tracking-widest mb-2">Efficiency</p>
                  <p className="text-4xl font-black text-white">A+</p>
                </div>
             </div>

             <div className="flex gap-6 max-w-sm mx-auto">
               <button 
                onClick={() => setCurrentStep('setup')}
                className="flex-1 py-5 bg-[#58a6ff] text-[#0b0e14] rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#58a6ff]/90 transition-all shadow-xl shadow-[#58a6ff]/10"
               >
                 Acknowledge
               </button>
               <button 
                onClick={startQuiz}
                className="flex-1 py-5 border-2 border-[#30363d] text-[#c9d1d9] rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#161b22] hover:border-[#58a6ff]/40 transition-all flex items-center justify-center gap-2"
               >
                 Retest Path
               </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
