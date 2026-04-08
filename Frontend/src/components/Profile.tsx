import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Flame, 
  Zap, 
  Award, 
  Edit2, 
  Save, 
  Camera, 
  LogOut, 
  ChevronRight,
  Star,
  CheckCircle2
} from 'lucide-react';
import { ScreenState } from '../types';

interface ProfileProps {
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  badges: string[];
  onUpdateProfile: (name: string, avatar: string) => void;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  name, 
  avatar, 
  xp, 
  streak, 
  badges, 
  onUpdateProfile,
  onLogout 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedAvatar, setEditedAvatar] = useState(avatar);

  const handleSave = () => {
    onUpdateProfile(editedName, editedAvatar);
    setIsEditing(false);
  };

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#131f24] overflow-y-auto no-scrollbar pb-20">
      {/* Profile Header */}
      <div className="relative pt-16 pb-8 px-6 bg-gradient-to-b from-brand-primary/5 to-white dark:from-brand-primary/10 dark:to-[#131f24]">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-[#1f2f36] border-4 border-white dark:border-[#131f24] shadow-xl overflow-hidden relative">
              <img 
                src={isEditing ? editedAvatar : avatar} 
                alt={name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                  <Camera className="w-8 h-8 text-white opacity-80" />
                </div>
              )}
            </div>
            
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-[#131f24]"
              >
                <Edit2 className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          <div className="mt-6 text-center w-full max-w-xs">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-[#1f2f36] border-2 border-slate-200 dark:border-[#37464f] rounded-2xl font-black text-center text-slate-800 dark:text-white focus:border-brand-primary outline-none transition-all"
                  placeholder="Your Name"
                />
                
                <div className="flex flex-wrap justify-center gap-2 py-2">
                  {avatarOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setEditedAvatar(opt)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all overflow-hidden ${
                        editedAvatar === opt ? 'border-brand-primary scale-110 shadow-md' : 'border-slate-100 dark:border-[#37464f] opacity-60'
                      }`}
                    >
                      <img src={opt} alt="Avatar option" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-[#37464f] text-slate-500 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-2 py-3 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg border-b-4 border-[#357abd]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{name}</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">AI Explorer Level 4</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 dark:bg-orange-500/10 rounded-[2rem] p-6 border-2 border-orange-100 dark:border-orange-500/20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-white dark:bg-[#1f2f36] rounded-2xl flex items-center justify-center shadow-sm mb-3">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
            </div>
            <span className="text-2xl font-black text-orange-600 dark:text-orange-400">{streak}</span>
            <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest mt-1">Day Streak</span>
          </div>
          
          <div className="bg-brand-primary/5 dark:bg-brand-primary/10 rounded-[2rem] p-6 border-2 border-brand-primary/10 dark:border-brand-primary/20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-white dark:bg-[#1f2f36] rounded-2xl flex items-center justify-center shadow-sm mb-3">
              <Zap className="w-6 h-6 text-brand-primary fill-brand-primary" />
            </div>
            <span className="text-2xl font-black text-brand-primary">{xp}</span>
            <span className="text-[9px] font-black text-brand-primary/60 uppercase tracking-widest mt-1">Total EXP</span>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Learning Progress</h3>
          <span className="text-[10px] font-black text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-lg">65% Complete</span>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-[#1f2f36] rounded-2xl p-4 border border-slate-100 dark:border-[#37464f] flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">Foundations of AI</span>
                <span className="text-[10px] font-bold text-slate-400">100%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-[#131f24] rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary w-full" />
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-brand-success" />
          </div>

          <div className="bg-slate-50 dark:bg-[#1f2f36] rounded-2xl p-4 border border-slate-100 dark:border-[#37464f] flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 dark:bg-[#37464f] rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">Neural Networks</span>
                <span className="text-[10px] font-bold text-slate-400">30%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-[#131f24] rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary w-[30%]" />
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="px-6 py-6">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Badges Earned</h3>
        <div className="grid grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <motion.div 
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 bg-yellow-50 dark:bg-yellow-500/10 rounded-2xl border-2 border-yellow-100 dark:border-yellow-500/20 flex items-center justify-center mb-2 shadow-sm">
                <Award className="w-7 h-7 text-yellow-500" />
              </div>
              <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 text-center uppercase tracking-tighter leading-tight">
                {badge}
              </span>
            </motion.div>
          ))}
          
          {/* Locked Badges */}
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center opacity-30">
              <div className="w-14 h-14 bg-slate-100 dark:bg-[#1f2f36] rounded-2xl border-2 border-slate-200 dark:border-[#37464f] flex items-center justify-center mb-2">
                <Award className="w-7 h-7 text-slate-400" />
              </div>
              <span className="text-[8px] font-black text-slate-400 text-center uppercase tracking-tighter leading-tight">
                Locked
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings/Logout */}
      <div className="px-6 py-8">
        <button 
          onClick={onLogout}
          className="w-full py-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 border-2 border-rose-100 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout Account
        </button>
      </div>
    </div>
  );
};
