import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BuildUpStep } from '../types';
import { Plus, Check, Zap, Sparkles } from 'lucide-react';

interface BuildUpDiagramProps {
  steps: BuildUpStep[];
  onComplete?: () => void;
  onNext?: () => void;
}

export const BuildUpDiagram: React.FC<BuildUpDiagramProps> = ({ steps, onComplete, onNext }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentStep]);

  const handleAddStep = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep === steps.length && onComplete) {
        onComplete();
      }
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div 
        ref={scrollRef}
        className="flex-1 flex flex-col gap-4 p-4 bg-slate-50 rounded-[2rem] border-2 border-slate-100 overflow-y-auto no-scrollbar scroll-smooth"
      >
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {steps.slice(0, currentStep).map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className="flex items-stretch gap-4"
              >
                <div className="flex flex-col items-center py-1">
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-sm shadow-[0_4px_0_0_#357abd] relative z-10"
                  >
                    {idx + 1}
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-3 h-3 text-white/50" />
                    </div>
                  </motion.div>
                  {idx < currentStep - 1 && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      className="w-1 bg-brand-primary/20 rounded-full my-2 flex-1" 
                    />
                  )}
                </div>
                <div className="flex-1 bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm mb-2 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-primary" />
                  
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[11px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-3 h-3 fill-brand-primary" />
                      {step.label}
                    </h4>
                    <div className="w-2 h-2 bg-brand-primary/20 rounded-full animate-pulse" />
                  </div>
                  
                  <p className="text-slate-600 text-xs font-bold leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Digital Pulse Effect */}
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent"
                  />
                  <motion.div 
                    animate={{ x: ['200%', '-100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {currentStep < steps.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 opacity-40 grayscale"
            >
              <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-black text-sm">
                {currentStep + 1}
              </div>
              <div className="flex-1 h-16 bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl" />
            </motion.div>
          )}
        </div>
      </div>

      {currentStep < steps.length ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddStep}
          className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-[0_4px_0_0_#357abd] flex items-center justify-center gap-3"
        >
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          Activate Next Layer
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNext && onNext()}
          className="w-full py-5 bg-brand-success text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-[0_4px_0_0_#46a302] flex items-center justify-center gap-3"
        >
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          Architecture Verified!
        </motion.button>
      )}
    </div>
  );
};
