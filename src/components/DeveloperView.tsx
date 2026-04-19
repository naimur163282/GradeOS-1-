import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Palette, 
  Globe,
  User,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function DeveloperView() {
  const socialLinks = [
    { icon: Globe, label: 'Portfolio', href: 'https://mdnaimurrashid.netlify.app', color: '#58a6ff' },
    { icon: Mail, label: 'Email', href: 'mailto:nako163282@gmail.com', color: '#f85149' },
    { icon: Linkedin, label: 'LinkedIn', href: '#', color: '#0a66c2' },
    { icon: Github, label: 'GitHub', href: '#', color: '#ffffff' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] overflow-hidden border-2 border-[#30363d] group-hover:border-[#58a6ff] transition-all duration-500 shadow-2xl bg-[#161b22] relative">
            <img 
              src="https://i.ibb.co.com/mVycmQP8/1000184822.jpg" 
              alt="Md. Naimur Rashid"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to initial icon if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-[#161b22] flex items-center justify-center text-[#8b949e] -z-10">
              <User size={80} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity"></div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#58a6ff] rounded-2xl flex items-center justify-center text-[#0b0e14] shadow-xl animate-bounce">
            <Code2 size={32} />
          </div>
        </motion.div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="badge-bento badge-primary mb-2 inline-block">Lead Developer & Designer</span>
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
              Md. Naimur Rashid
            </h1>
            <p className="text-xl text-[#8b949e] font-medium mt-2">
              Transforming complex problems into elegant, AI-driven digital experiences.
            </p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            {socialLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#161b22] border border-[#30363d] rounded-2xl text-sm font-bold text-[#c9d1d9] hover:border-[#58a6ff] hover:bg-[#58a6ff]/5 transition-all group"
              >
                <link.icon size={18} style={{ color: link.color }} />
                {link.label}
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bento-card space-y-6"
        >
          <div className="flex items-center gap-3 text-[#58a6ff]">
            <Palette size={24} />
            <h2 className="text-xl font-black tracking-tight text-white">Creative Vision</h2>
          </div>
          <p className="text-[#8b949e] leading-relaxed">
            I believe that technology should be invisible. Every click, every transition, and every layout in 
            <span className="text-[#58a6ff] font-bold mx-1">GradeOS</span> was crafted with the student's cognitive load in mind. 
            From the Bento-inspired architecture to the neural AI integration, my goal is to create systems that empower through clarity.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-card border-[#3fb950]/20 bg-gradient-to-br from-[#161b22] to-[#0b0e14]"
        >
          <div className="flex items-center gap-3 text-[#3fb950]">
            <MessageSquare size={24} />
            <h2 className="text-xl font-black tracking-tight text-white">Let's Collaborate</h2>
          </div>
          <div className="space-y-4">
            <p className="text-[#8b949e] leading-relaxed">
              Interested in building high-performance AI applications, sophisticated SaaS platforms, or polished user interfaces? 
              I am available for strategic consultancy and custom software development.
            </p>
            <div className="pt-4">
              <a 
                href="mailto:nako163282@gmail.com"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#3fb950] text-[#0b0e14] rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-[#3fb950]/20 transition-all"
              >
                Start a Conversation
                <Mail size={20} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bento-card text-center p-12 border-dashed border-[#30363d]"
      >
        <h3 className="text-xs font-black text-[#8b949e] uppercase tracking-[0.5em] mb-4">Tech Stack Synergy</h3>
        <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
          {['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Lucide Icons', 'Google Gemini AI'].map((tech) => (
            <span key={tech} className="text-lg font-black text-white hover:text-[#58a6ff] transition-colors">{tech}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
