import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { AnalogyData } from '../types';
import { Lightbulb } from 'lucide-react';

interface AnalogyCardProps {
  data: AnalogyData;
  onComplete?: () => void;
}

export const AnalogyCard: React.FC<AnalogyCardProps> = ({ data, onComplete }) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-full flex flex-col items-center justify-center p-8 text-center gap-6 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-primary/5 to-brand-primary/10 border-2 border-brand-primary/10"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -ml-16 -mb-16" />

      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="text-7xl mb-2 drop-shadow-xl"
      >
        {data.emoji}
      </motion.div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-[1px] w-8 bg-brand-primary/20" />
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">The Analogy</span>
          <div className="h-[1px] w-8 bg-brand-primary/20" />
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
          {data.metaphor}
        </h3>
        
        <div className="bg-white/60 backdrop-blur-md border border-white/40 p-5 rounded-2xl shadow-sm">
          <p className="text-slate-600 text-sm font-bold leading-relaxed italic">
            "{data.explanation}"
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 flex items-center gap-2 text-brand-primary/40">
        <Lightbulb className="w-4 h-4" />
        <span className="text-[9px] font-black uppercase tracking-widest">Aibo Insight</span>
      </div>
    </motion.div>
  );
};
