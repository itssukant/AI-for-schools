import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ChatDialogueProps {
  messages: ChatMessage[];
  onComplete?: () => void;
}

const TypingIndicator = () => (
  <div className="flex gap-1 px-2 py-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        className="w-1.5 h-1.5 bg-brand-primary rounded-full"
      />
    ))}
  </div>
);

export const ChatDialogue: React.FC<ChatDialogueProps> = ({ messages, onComplete }) => {
  const [visibleMessages, setVisibleMessages] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  useEffect(() => {
    if (visibleMessages === messages.length && !isTyping && onComplete) {
      onComplete();
    }
  }, [visibleMessages, isTyping, messages.length, onComplete]);

  const handleNextMessage = () => {
    if (visibleMessages < messages.length) {
      setIsTyping(true);
      setTimeout(() => {
        setVisibleMessages(prev => prev + 1);
        setIsTyping(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div 
        ref={scrollRef}
        className="flex-1 flex flex-col gap-4 p-4 bg-slate-50 rounded-[2rem] border-2 border-slate-100 overflow-y-auto no-scrollbar scroll-smooth"
      >
        <AnimatePresence mode="popLayout">
          {messages.slice(0, visibleMessages).map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex items-end gap-2 ${msg.role === 'mentor' ? 'justify-start' : 'justify-end'}`}
            >
              {msg.role === 'mentor' && (
                <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] p-4 rounded-2xl text-[13px] font-bold shadow-sm leading-relaxed relative ${
                  msg.role === 'mentor'
                    ? 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                    : 'bg-brand-primary text-white rounded-br-none'
                }`}
              >
                {msg.text}
                {/* Subtle tail */}
                <div className={`absolute bottom-0 w-4 h-4 ${
                  msg.role === 'mentor' 
                    ? '-left-2 bg-white border-l border-b border-slate-200 rotate-45 -z-10' 
                    : '-right-2 bg-brand-primary rotate-45 -z-10'
                }`} />
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {visibleMessages < messages.length && !isTyping && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNextMessage}
          className="w-full py-4 bg-white text-brand-primary rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-brand-primary/20 hover:bg-brand-primary/5 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          Next Message
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};
