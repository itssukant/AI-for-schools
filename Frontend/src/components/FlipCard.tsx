import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FlipCardData } from '../types';
import { HelpCircle, RefreshCw, Sparkles } from 'lucide-react';

interface FlipCardProps {
  data: FlipCardData;
  onComplete?: () => void;
}

export const FlipCard: React.FC<FlipCardProps> = ({ data, onComplete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onComplete) onComplete();
  };

  return (
    <div 
      className="relative w-full h-full cursor-pointer perspective-1000"
      onClick={handleFlip}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
        className="w-full h-full relative preserve-3d"
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] shadow-[0_8px_0_0_#e5e5e5]">
          <div className="absolute top-6 right-6">
            <Sparkles className="w-5 h-5 text-brand-primary/20" />
          </div>
          
          <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mb-8 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-brand-primary/30 rounded-full"
            />
            <HelpCircle className="w-12 h-12 text-brand-primary" />
          </div>
          
          <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight">
            {data.front}
          </h3>
          
          <div className="flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <RefreshCw className="w-3 h-3" />
            Tap to Reveal
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center p-8 bg-brand-primary border-2 border-brand-primary/20 rounded-[2.5rem] shadow-[0_8px_0_0_#357abd]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="absolute top-6 left-6">
            <Sparkles className="w-5 h-5 text-white/20" />
          </div>

          <p className="text-white font-black text-xl md:text-2xl leading-tight tracking-tight mb-8">
            {data.back}
          </p>
          
          <div className="flex items-center gap-2 text-white/60 font-black text-[10px] uppercase tracking-[0.3em]">
            <RefreshCw className="w-3 h-3" />
            Tap to Flip Back
          </div>
        </div>
      </motion.div>
    </div>
  );
};
