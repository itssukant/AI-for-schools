import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PredictRevealData } from '../types';
import { CheckCircle2, XCircle, Sparkles, AlertCircle } from 'lucide-react';

interface PredictRevealProps {
  data: PredictRevealData;
  onComplete?: () => void;
}

export const PredictReveal: React.FC<PredictRevealProps> = ({ data, onComplete }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleSelect = (idx: number) => {
    if (isRevealed) return;
    setSelected(idx);
    setIsRevealed(true);
    if (onComplete) onComplete();
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 h-full overflow-y-auto no-scrollbar">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-[0.3em]">
          <AlertCircle className="w-3 h-3" />
          Predict the Outcome
        </div>
        <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight">
          {data.scenario}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {data.options.map((opt, idx) => {
          const isCorrect = idx === data.correctAnswer;
          const isSelected = idx === selected;
          
          return (
            <motion.button
              key={idx}
              whileHover={!isRevealed ? { scale: 1.02, x: 4 } : {}}
              whileTap={!isRevealed ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(idx)}
              disabled={isRevealed}
              className={`w-full p-4 rounded-2xl border-2 font-bold text-sm text-left transition-all flex items-center justify-between group ${
                isRevealed
                  ? isCorrect
                    ? 'bg-brand-success/10 border-brand-success text-brand-success shadow-[0_4px_0_0_#46a302]'
                    : isSelected
                    ? 'bg-rose-50 border-rose-500 text-rose-500 shadow-[0_4px_0_0_#e11d48]'
                    : 'bg-white border-slate-100 text-slate-400 opacity-50'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-brand-primary hover:shadow-[0_4px_0_0_#4a90e2] shadow-[0_4px_0_0_#e5e5e5]'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border-2 ${
                  isRevealed && isCorrect ? 'bg-brand-success border-white text-white' : 
                  isRevealed && isSelected ? 'bg-rose-500 border-white text-white' :
                  'bg-slate-100 border-slate-200 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </span>
              {isRevealed && isCorrect && <CheckCircle2 className="w-5 h-5" />}
              {isRevealed && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-2 p-5 bg-white border-2 border-brand-primary/20 rounded-2xl shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary" />
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">The Reveal</span>
            </div>
            <p className="text-slate-600 text-sm font-bold leading-relaxed">
              {data.revealText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
