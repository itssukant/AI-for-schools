import React from 'react';
import { motion } from 'motion/react';
import { Star, Zap, Star as Coin, ChevronLeft, Trophy, Target, Flame, Battery } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  type: 'XP' | 'ENERGY' | 'COINS';
}

interface QuestsProps {
  quests: Quest[];
  onBack: () => void;
  onClaim: (questId: string) => void;
}

export const Quests: React.FC<QuestsProps> = ({ quests, onBack, onClaim }) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#131f24]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 border-b border-slate-100 dark:border-[#37464f]">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2f36]"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Quests</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* Daily Quests Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Target className="w-4 h-4 text-brand-primary" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Daily Quests</h2>
          </div>

          <div className="space-y-4">
            {quests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1f2f36] border-2 border-slate-100 dark:border-[#37464f] rounded-3xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">{quest.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">{quest.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-brand-primary/10 px-3 py-1.5 rounded-xl border border-brand-primary/20">
                    {quest.type === 'XP' && <Star className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />}
                    {quest.type === 'ENERGY' && <Battery className="w-3.5 h-3.5 text-brand-success fill-brand-success" />}
                    {quest.type === 'COINS' && <Coin className="w-3.5 h-3.5 text-brand-warning fill-brand-warning" />}
                    <span className="text-[10px] font-black text-brand-primary">+{quest.reward}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                    <span className="text-[10px] font-black text-brand-primary">{quest.progress}/{quest.total}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-[#131f24] rounded-full overflow-hidden border border-slate-200 dark:border-[#37464f]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(quest.progress / quest.total) * 100}%` }}
                      className={`h-full ${quest.progress >= quest.total ? 'bg-brand-success' : 'bg-brand-primary'}`}
                    />
                  </div>
                </div>

                {quest.progress >= quest.total && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onClaim(quest.id)}
                    className="w-full mt-4 py-3 bg-brand-success text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_4px_0_0_#059669]"
                  >
                    Claim Reward
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievement Section */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Trophy className="w-4 h-4 text-brand-warning" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Achievements</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-[#1f2f36] border-2 border-slate-100 dark:border-[#37464f] rounded-3xl p-4 flex flex-col items-center text-center opacity-60">
              <div className="w-12 h-12 bg-slate-200 dark:bg-[#37464f] rounded-2xl flex items-center justify-center mb-3">
                <Flame className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">7 Day Streak</h4>
              <p className="text-[8px] text-slate-400 font-bold">Locked</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#1f2f36] border-2 border-slate-100 dark:border-[#37464f] rounded-3xl p-4 flex flex-col items-center text-center opacity-60">
              <div className="w-12 h-12 bg-slate-200 dark:bg-[#37464f] rounded-2xl flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">AI Master</h4>
              <p className="text-[8px] text-slate-400 font-bold">Locked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
