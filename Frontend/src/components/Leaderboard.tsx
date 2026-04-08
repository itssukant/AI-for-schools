import React from 'react';
import { motion } from 'motion/react';
import { Flame, Trophy, ChevronLeft, User as UserIcon } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onBack: () => void;
  currentXp: number;
  userStreak: number;
}

const TIERS = [
  { name: 'BRONZE', color: '#B06D50', icon: 'V' },
  { name: 'SILVER', color: '#B5B9BD', icon: 'Y' },
  { name: 'GOLD', color: '#D4AF37', icon: 'Y' },
  { name: 'PLATINUM', color: '#D1D5D8', icon: 'W' },
  { name: 'DIAMOND', color: '#99D2E9', icon: 'Y' },
  { name: 'MASTER', color: '#E5C158', icon: 'M' },
];

const HexagonIcon = ({ color, active, type, isCurrent }: { color: string; active?: boolean; type: string; isCurrent?: boolean }) => {
  const getPath = () => {
    switch (type) {
      case 'BRONZE':
        return "M 30 45 L 50 65 L 70 45"; // V shape
      case 'SILVER':
        return "M 30 35 L 50 55 L 70 35 M 50 55 L 50 80"; // Y shape
      case 'GOLD':
        return "M 30 35 L 50 55 L 70 35 M 50 55 L 50 80"; // Y shape
      case 'PLATINUM':
        return "M 30 35 L 30 75 M 50 35 L 50 75 M 70 35 L 70 75"; // W shape (3 bars)
      case 'DIAMOND':
        return "M 25 35 L 50 60 L 75 35 M 50 60 L 50 85"; // Wide Y shape
      case 'MASTER':
        return "M 20 65 L 30 35 L 40 55 L 50 35 L 60 55 L 70 35 L 80 65 L 65 85 L 35 85 Z"; // Crown shape
      default:
        return "";
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ 
        scale: isCurrent ? 1.2 : (active ? 1.1 : 0.9), 
        opacity: active ? 1 : 0.3,
        filter: isCurrent ? `drop-shadow(0 0 12px ${color})` : 'none'
      }}
      className="relative w-11 h-13 flex items-center justify-center transition-all duration-300"
    >
      <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]">
        <path
          d="M50 0 L100 28.75 L100 86.25 L50 115 L0 86.25 L0 28.75 Z"
          fill={color}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="4"
        />
        <path
          d="M50 6 L94 32 L94 83 L50 109 L6 83 L6 32 Z"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <svg viewBox="0 0 100 100" className="w-7 h-7">
          <path
            d={getPath()}
            fill={type === 'MASTER' ? 'white' : 'none'}
            stroke="white"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-95"
          />
        </svg>
      </div>
      {isCurrent && (
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-white/20 blur-xl"
        />
      )}
    </motion.div>
  );
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onBack, currentXp, userStreak }) => {
  const sortedEntries = [...entries].sort((a, b) => b.xp - a.xp);
  
  const getCurrentTierIndex = () => {
    if (currentXp >= 1000) return 5; // Master
    if (currentXp >= 800) return 4; // Diamond
    if (currentXp >= 600) return 3; // Platinum
    if (currentXp >= 400) return 2; // Gold
    if (currentXp >= 200) return 1; // Silver
    return 0; // Bronze
  };

  const currentTierIdx = getCurrentTierIndex();
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#131f24]">
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-[#131f24]">
        {/* Top Navigation - Now scrolls */}
        <div className="pt-8 pb-2 px-6 flex items-center">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-[#1f2f36] rounded-full transition-colors bg-slate-50 dark:bg-[#1f2f36] shadow-sm border border-slate-100 dark:border-[#37464f]">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Tiers Row - Smaller and scrolls */}
        <div className="px-2 py-4 flex justify-center items-center bg-white dark:bg-[#131f24] border-b border-slate-100 dark:border-[#37464f]">
          <div className="flex justify-between w-full max-w-md px-2">
            {TIERS.map((tier, idx) => (
              <div key={tier.name} className="flex flex-col items-center gap-1.5">
                <HexagonIcon 
                  color={tier.color} 
                  active={idx <= currentTierIdx} 
                  isCurrent={idx === currentTierIdx}
                  type={tier.name} 
                />
                <span className={`text-[6px] font-black tracking-widest ${idx <= currentTierIdx ? 'text-slate-800 dark:text-slate-200' : 'text-slate-300 dark:text-slate-600'}`}>
                  {tier.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Division Header - Smaller and scrolls */}
        <div className="px-6 py-4 flex flex-col items-center bg-slate-50/30 dark:bg-[#1f2f36]/30 border-b border-slate-100 dark:border-[#37464f]">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">DIVISION</span>
            <span className="text-xl font-black text-[#99D2E9] tracking-widest">{TIERS[currentTierIdx].name}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">STREAK</span>
            <motion.span 
              key={userStreak}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-[12px] font-black text-orange-500 ml-1"
            >
              {userStreak}
            </motion.span>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="px-4 py-4 space-y-3 bg-white dark:bg-[#131f24]">
          {sortedEntries.map((entry, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(153, 210, 233, 0.03)' }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-default ${
                  entry.isCurrentUser 
                    ? 'bg-brand-primary/5 dark:bg-brand-primary/10 border-brand-primary shadow-sm' 
                    : isTop3 
                      ? 'bg-white dark:bg-[#1f2f36] border-slate-100 dark:border-[#37464f] shadow-sm' 
                      : 'bg-white dark:bg-[#1f2f36] border-transparent'
                }`}
              >
                {/* Rank Badge - Medals for top 3 */}
                <div className="w-10 flex justify-center shrink-0">
                  {rank === 1 ? (
                    <div className="relative">
                      <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-500/10 rounded-full flex items-center justify-center border-2 border-yellow-200 dark:border-yellow-500/20 shadow-sm">
                        <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-white dark:border-[#131f24] flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-black text-white">1</span>
                      </div>
                    </div>
                  ) : rank === 2 ? (
                    <div className="relative">
                      <div className="w-10 h-10 bg-slate-50 dark:bg-slate-500/10 rounded-full flex items-center justify-center border-2 border-slate-200 dark:border-slate-500/20 shadow-sm">
                        <Trophy className="w-6 h-6 text-slate-400 fill-slate-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-400 rounded-full border-2 border-white dark:border-[#131f24] flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-black text-white">2</span>
                      </div>
                    </div>
                  ) : rank === 3 ? (
                    <div className="relative">
                      <div className="w-10 h-10 bg-orange-50/50 dark:bg-orange-500/10 rounded-full flex items-center justify-center border-2 border-orange-100/50 dark:border-orange-500/20 shadow-sm">
                        <Trophy className="w-6 h-6 text-orange-400 fill-orange-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-300 rounded-full border-2 border-white dark:border-[#131f24] flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-black text-white">3</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm font-black text-slate-400 dark:text-slate-500">{rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#37464f] border-2 border-white dark:border-[#131f24] shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                  {entry.avatar ? (
                    <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  )}
                </div>

                {/* Name & Streak */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[15px] font-black truncate ${entry.isCurrentUser ? 'text-brand-primary' : 'text-slate-800 dark:text-slate-200'}`}>
                    {entry.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">STREAK</span>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                      <span className="text-[11px] font-black text-orange-500">{entry.streak}</span>
                    </div>
                  </div>
                </div>

                {/* XP */}
                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-slate-900 dark:text-white">{entry.xp}</div>
                  <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">EXP</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
