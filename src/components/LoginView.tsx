import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  GithubAuthProvider 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function LoginView() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Please try again or create an account.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Authentication failed: ' + err.message);
      }
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'github') => {
    setIsLoading(true);
    setError('');
    const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError('Sync failed: ' + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#58a6ff]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#3fb950]/5 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-[#58a6ff] rounded-[2rem] flex items-center justify-center text-[#0b0e14] mx-auto shadow-2xl shadow-[#58a6ff]/20">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">GradeOS</h1>
          <p className="text-[#8b949e] font-medium">The AI Academic Co-Pilot for Students</p>
        </div>

        <div className="bento-card border-[#30363d] p-10 space-y-8 backdrop-blur-xl bg-[#161b22]/80">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-sm text-[#8b949e]">{isLogin ? 'Access your personalized learning environment.' : 'Start your AI-driven academic journey today.'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em] pl-1">Educational Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#30363d]" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-12 pr-4 py-4 bg-[#0b0e14] border border-[#30363d] rounded-2xl text-white placeholder-[#30363d] focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/5 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.2em] pl-1">Secure Passkey</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#30363d]" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-[#0b0e14] border border-[#30363d] rounded-2xl text-white placeholder-[#30363d] focus:border-[#58a6ff] focus:ring-4 focus:ring-[#58a6ff]/5 outline-none transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-4 bg-[#f85149]/10 border border-[#f85149]/20 rounded-xl text-[#f85149] text-xs font-bold"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-white text-[#0b0e14] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#58a6ff] transition-all flex items-center justify-center gap-3 shadow-xl group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0b0e14]/20 border-t-[#0b0e14] rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Initialize System' : 'Create Identity'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-xs font-black text-[#8b949e] uppercase tracking-widest hover:text-[#58a6ff] transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#30363d]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#161b22] px-4 text-[#8b949e] font-black lowercase tracking-[0.2em]">or neural sync via</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-2 py-4 bg-[#0b0e14] border border-[#30363d] rounded-2xl hover:bg-[#161b22] transition-all group"
            >
              <Chrome size={18} className="text-[#8b949e] group-hover:text-white transition-colors" />
              <span className="text-xs font-bold text-[#8b949e] group-hover:text-white">Google</span>
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              className="flex items-center justify-center gap-2 py-4 bg-[#0b0e14] border border-[#30363d] rounded-2xl hover:bg-[#161b22] transition-all group"
            >
              <Github size={18} className="text-[#8b949e] group-hover:text-white transition-colors" />
              <span className="text-xs font-bold text-[#8b949e] group-hover:text-white">GitHub</span>
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-[#30363d] font-black uppercase tracking-[0.3em] font-mono">
          System v1.4.2 // Encrypted Node // Asia-Pacific Edge
        </p>
      </motion.div>
    </div>
  );
}
