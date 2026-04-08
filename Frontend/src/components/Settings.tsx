import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Moon, Sun, Bell, Shield, HelpCircle, LogOut, User, Mail, Globe, Info } from 'lucide-react';

interface SettingsProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
  onLogout: () => void;
  userName: string;
  userEmail: string;
}

export const Settings: React.FC<SettingsProps> = ({ 
  darkMode, 
  onToggleDarkMode, 
  onBack, 
  onLogout,
  userName,
  userEmail
}) => {
  const sections = [
    {
      title: 'Preferences',
      items: [
        { 
          id: 'dark-mode', 
          label: 'Dark Mode', 
          icon: darkMode ? Moon : Sun, 
          type: 'toggle', 
          value: darkMode, 
          action: onToggleDarkMode 
        },
        { id: 'notifications', label: 'Notifications', icon: Bell, type: 'link' },
        { id: 'language', label: 'Language', icon: Globe, type: 'value', value: 'English' },
      ]
    },
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Edit Profile', icon: User, type: 'link' },
        { id: 'email', label: 'Email', icon: Mail, type: 'value', value: userEmail },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield, type: 'link' },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help Center', icon: HelpCircle, type: 'link' },
        { id: 'about', label: 'About Aibo', icon: Info, type: 'link' },
      ]
    }
  ];

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
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
              {section.title}
            </h2>
            <div className="bg-slate-50 dark:bg-[#1f2f36] border-2 border-slate-100 dark:border-[#37464f] rounded-[2.5rem] overflow-hidden">
              {section.items.map((item, idx) => (
                <div 
                  key={item.id}
                  className={`flex items-center justify-between p-5 ${
                    idx !== section.items.length - 1 ? 'border-b border-slate-100 dark:border-[#37464f]' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      darkMode ? 'bg-[#37464f] text-brand-primary' : 'bg-white text-brand-primary shadow-sm'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
                  </div>

                  {item.type === 'toggle' ? (
                    <button 
                      onClick={item.action}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        item.value ? 'bg-brand-primary' : 'bg-slate-200 dark:bg-[#37464f]'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: item.value ? 24 : 4 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  ) : item.type === 'value' ? (
                    <span className="text-xs font-bold text-slate-400">{item.value}</span>
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full py-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-rose-100 dark:border-rose-500/20 flex items-center justify-center gap-3"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </motion.button>

        <div className="text-center pb-8">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Aibo v1.0.4</p>
        </div>
      </div>
    </div>
  );
};
