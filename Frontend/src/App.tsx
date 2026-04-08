/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, ArrowRight, Send, Loader2, CheckCircle2, Trophy, Zap, Star, Lightbulb, Check, AlertCircle, ChevronRight, ChevronLeft, HelpCircle, Eye, Home, User, Settings as SettingsIcon, Heart, Plus, Flame } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { LESSON_CONTENT, QUIZ_QUESTIONS } from './constants';
import { LessonSection, QuizQuestion, ScreenState, LeaderboardEntry } from './types';
import { ChatDialogue } from './components/ChatDialogue';
import { AnalogyCard } from './components/AnalogyCard';
import { FlipCard } from './components/FlipCard';
import { PredictReveal } from './components/PredictReveal';
import { BuildUpDiagram } from './components/BuildUpDiagram';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Quests } from './components/Quests';
import { Settings } from './components/Settings';

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Alex AI', xp: 1250, streak: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: '2', name: 'Sarah Spark', xp: 1100, streak: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: '3', name: 'Leo Learn', xp: 950, streak: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo' },
  { id: '4', name: 'Maya Mind', xp: 800, streak: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya' },
  { id: '5', name: 'Zane Zap', xp: 750, streak: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zane' },
  { id: '6', name: 'Ivy Intel', xp: 600, streak: 7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivy' },
  { id: '7', name: 'Noah Neural', xp: 550, streak: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah' },
];

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

type MascotMood = 'HAPPY' | 'THINKING' | 'SAD' | 'CELEBRATING' | 'NEUTRAL';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('LOADING');
  const [prevScreen, setPrevScreen] = useState<ScreenState | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(1);
  const [energy, setEnergy] = useState(100);
  const [coins, setCoins] = useState(150);
  const [hearts, setHearts] = useState(5);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>(['AI Novice', 'Fast Learner']);
  const [showBadgeModal, setShowBadgeModal] = useState<string | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<QuizQuestion[]>([]);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(true);
  const [isInteractiveComplete, setIsInteractiveComplete] = useState(false);
  const [userName, setUserName] = useState('Arnav');
  const [userAvatar, setUserAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');
  const [darkMode, setDarkMode] = useState(false);
  const [unlockedUnits, setUnlockedUnits] = useState([1]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quests, setQuests] = useState<{ id: string; title: string; description: string; progress: number; total: number; reward: number; type: 'XP' | 'ENERGY' | 'COINS' }[]>([
    { id: 'q1', title: 'Daily Explorer', description: 'Complete 1 lesson today', progress: 0, total: 1, reward: 50, type: 'XP' },
    { id: 'q2', title: 'Quiz Master', description: 'Get 5 correct answers in a row', progress: 0, total: 5, reward: 10, type: 'ENERGY' },
    { id: 'q3', title: 'Streak Saver', description: 'Maintain a 3-day streak', progress: 1, total: 3, reward: 20, type: 'COINS' },
  ]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const totalSteps = LESSON_CONTENT.length + QUIZ_QUESTIONS.length;
  const currentStep = screen === 'LESSON' ? currentSection : LESSON_CONTENT.length + currentQuiz;
  const progress = (currentStep / (totalSteps - 1)) * 100;

  const currentLesson = LESSON_CONTENT[currentSection];
  const currentQuestion = QUIZ_QUESTIONS[currentQuiz];

  const navigateTo = (newScreen: ScreenState) => {
    setPrevScreen(screen);
    setScreen(newScreen);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy(prev => Math.min(100, prev + 1));
    }, 30000); // +1 energy every 30 seconds
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (screen === 'LOADING') {
      const timer = setTimeout(() => {
        navigateTo('LOGIN');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const handlePrev = () => {
    if (screen === 'LESSON') {
      if (currentSection > 0) {
        setCurrentSection(prev => prev - 1);
        setIsInteractiveComplete(false);
      }
    } else if (screen === 'QUIZ') {
      if (currentQuiz > 0) {
        setCurrentQuiz(prev => prev - 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setIsCorrect(null);
      } else {
        navigateTo('LESSON');
        setCurrentSection(LESSON_CONTENT.length - 1);
      }
    }
  };

  const handleNext = () => {
    if (screen === 'LESSON') {
      if (currentSection < LESSON_CONTENT.length - 1) {
        setCurrentSection(prev => prev + 1);
        setPoints(prev => prev + 50);
        setIsInteractiveComplete(false);
      } else {
        navigateTo('PRE_QUIZ');
      }
    } else if (screen === 'PRE_QUIZ') {
      if (energy >= 10) {
        setEnergy(prev => Math.max(0, prev - 10));
        navigateTo('QUIZ');
      } else {
        alert("Not enough energy! Wait for it to charge or get a streak bonus.");
      }
    } else if (screen === 'QUIZ') {
      if (isAnswered) {
        if (currentQuiz < QUIZ_QUESTIONS.length - 1) {
          setCurrentQuiz(prev => prev + 1);
          setSelectedOption(null);
          setIsAnswered(false);
          setIsCorrect(null);
        } else {
          navigateTo('SCORE');
          setIsAnswered(false);
          setShowRewardModal(true);
          setCoins(prev => prev + 25);
          if (!badges.includes('AI Explorer')) {
            setBadges(prev => [...prev, 'AI Explorer']);
            setShowBadgeModal('AI Explorer');
          }
        }
      } else if (selectedOption !== null) {
        const correct = selectedOption === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setIsAnswered(true);
        if (correct) {
          setScore(prev => prev + 1);
          setPoints(prev => prev + 5);
          const newStreak = correctStreak + 1;
          setCorrectStreak(newStreak);
          
          // Streak bonus
          if (newStreak % 5 === 0) {
            setEnergy(prev => Math.min(100, prev + 6));
            setCoins(prev => prev + 10);
          }
        } else {
          setIncorrectAnswers(prev => [...prev, currentQuestion]);
          setCorrectStreak(0);
          setHearts(prev => Math.max(0, prev - 1));
        }
      }
    } else if (screen === 'SCORE') {
      navigateTo('LESSON');
      setCurrentSection(0);
      setCurrentQuiz(0);
      setScore(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setIncorrectAnswers([]);
      setIsExplanationExpanded(true);
    } else {
      navigateTo('LESSON');
      setCurrentSection(0);
      setCurrentQuiz(0);
      setScore(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setIncorrectAnswers([]);
      setIsExplanationExpanded(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans selection:bg-brand-primary/20 overflow-hidden">
      {/* Student-Friendly Device Frame */}
      <div className="relative w-full max-w-[375px] h-[92vh] max-h-[812px] bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border-8 border-slate-200 flex flex-col">
        
        {/* Header - Stats & Progress */}
        {screen !== 'LOADING' && screen !== 'LOGIN' && screen !== 'SIGN_IN' && screen !== 'REGISTER' && (
          <div className="px-6 pt-12 pb-4 flex flex-col gap-4 bg-white dark:bg-[#131f24] border-b border-slate-100 dark:border-[#37464f] relative z-[100]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-500/20">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="font-black text-orange-600 dark:text-orange-400 text-xs">{streak}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-brand-primary/5 dark:bg-brand-primary/10 px-3 py-1.5 rounded-full border border-brand-primary/10 dark:border-brand-primary/20">
                  <Star className="w-4 h-4 text-brand-primary fill-brand-primary" />
                  <span className="font-black text-brand-primary text-xs">{coins}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#1f2f36] px-3 py-1.5 rounded-full border border-slate-100 dark:border-[#37464f] relative overflow-hidden">
                  <div className="w-12 h-2 bg-slate-200 dark:bg-[#131f24] rounded-full overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${energy}%`,
                        backgroundColor: energy < 100 ? ['#4A90E2', '#64B5F6', '#4A90E2'] : '#4A90E2'
                      }}
                      transition={{
                        width: { type: "spring", stiffness: 50, damping: 20 },
                        backgroundColor: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="h-full bg-brand-primary"
                    />
                    {energy < 100 && (
                      <motion.div 
                        animate={{ x: [-20, 60] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-6 h-full bg-white/30 skew-x-12 blur-[2px]"
                      />
                    )}
                  </div>
                  <motion.div
                    animate={energy < 100 ? {
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                      filter: ["drop-shadow(0 0 0px #4A90E2)", "drop-shadow(0 0 4px #4A90E2)", "drop-shadow(0 0 0px #4A90E2)"]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Zap className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />
                  </motion.div>
                </div>
                <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-100 dark:border-rose-500/20">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="font-black text-rose-600 dark:text-rose-400 text-xs">{hearts}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar - Only for LESSON and QUIZ */}
            {(screen === 'LESSON' || screen === 'QUIZ') && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowExitModal(true)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-[#1f2f36] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-300 dark:text-slate-500" />
                </button>
                <div className="flex-1 h-3 bg-slate-100 dark:bg-[#131f24] rounded-full relative overflow-hidden border border-slate-200 dark:border-[#37464f]">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-brand-primary rounded-full shadow-[0_0_10px_rgba(74,144,226,0.3)]"
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  />
                </div>
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest whitespace-nowrap">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content Area - Spacious & Aligned */}
        <div className={`flex-1 flex flex-col relative overflow-hidden bg-white ${screen === 'LEADERBOARD' ? 'px-0 py-0' : 'px-6 py-2'}`}>
          <AnimatePresence mode="wait">
            {screen === 'LEADERBOARD' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <Leaderboard 
                  entries={[
                    ...MOCK_LEADERBOARD,
                    { id: 'current', name: userName, xp: points, streak: streak, avatar: userAvatar, isCurrentUser: true }
                  ]}
                  currentXp={points}
                  userStreak={streak}
                  onBack={() => {
                    if (prevScreen) {
                      setScreen(prevScreen);
                    } else {
                      setScreen('HUB');
                    }
                  }}
                />
              </motion.div>
            )}
            {screen === 'PROFILE' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <Profile 
                  name={userName}
                  avatar={userAvatar}
                  xp={points}
                  streak={streak}
                  badges={badges}
                  onUpdateProfile={(name, avatar) => {
                    setUserName(name);
                    setUserAvatar(avatar);
                  }}
                  onLogout={() => navigateTo('LOGIN')}
                />
              </motion.div>
            )}
            {screen === 'QUESTS' && (
              <motion.div
                key="quests"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <Quests 
                  quests={quests}
                  onBack={() => navigateTo('HUB')}
                  onClaim={(questId) => {
                    const quest = quests.find(q => q.id === questId);
                    if (quest) {
                      if (quest.type === 'XP') setPoints(prev => prev + quest.reward);
                      if (quest.type === 'ENERGY') setEnergy(prev => Math.min(100, prev + quest.reward));
                      if (quest.type === 'COINS') setCoins(prev => prev + quest.reward);
                      setQuests(prev => prev.map(q => q.id === questId ? { ...q, progress: 0 } : q));
                      setShowRewardModal(true);
                    }
                  }}
                />
              </motion.div>
            )}
            {screen === 'SETTINGS' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <Settings 
                  darkMode={darkMode}
                  onToggleDarkMode={() => setDarkMode(!darkMode)}
                  onBack={() => navigateTo('HUB')}
                  onLogout={() => navigateTo('LOGIN')}
                  userName={userName}
                  userEmail={`${userName.toLowerCase()}@example.com`}
                />
              </motion.div>
            )}
            {screen === 'LOADING' && (
              <motion.div 
                key="loading"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] bg-[#99D2E9] flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  <h1 className="text-[#2D5E8B] text-6xl font-black tracking-tighter lowercase" style={{ fontFamily: 'system-ui, sans-serif' }}>
                    learn
                  </h1>
                  <motion.div 
                    className="mt-8 flex gap-1"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-[#2D5E8B] rounded-full" />
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {screen === 'LOGIN' && (
              <motion.div 
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[90] bg-[#99C7E1] flex flex-col items-center justify-between p-8 pt-32"
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center -mt-20">
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[#262244] text-6xl font-black tracking-tighter lowercase mb-2"
                  >
                    learn
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-[#2D5E8B] text-[11px] font-bold leading-relaxed max-w-[200px]"
                  >
                    The most effective, fun and best way to learn about AI
                  </motion.p>
                </div>

                <div className="w-full flex flex-col gap-3 pb-10 px-2">
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setScreen('REGISTER')}
                    className="w-full py-4 bg-[#262244] text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-[0_4px_0_0_#1a1730]"
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setScreen('SIGN_IN')}
                    className="w-full py-4 bg-transparent text-[#262244] border-2 border-[#262244] rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-[0_4px_0_0_#262244]"
                  >
                    I already have an account
                  </motion.button>
                </div>
              </motion.div>
            )}

            {screen === 'REGISTER' && (
              <motion.div 
                key="register"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[90] bg-[#91C8E4] flex flex-col items-center p-8 overflow-y-auto no-scrollbar"
              >
                <div className="w-full flex flex-col items-center text-center mt-4 mb-8">
                  <h2 className="text-[#241E45] text-3xl font-black tracking-tight">Create Your Profile</h2>
                </div>

                <div className="w-full space-y-4">
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="Age" 
                      className="w-full py-4 px-6 bg-white/20 border-2 border-[#2D5E8B]/30 rounded-[25px] text-[#2D5E8B] font-bold placeholder:text-[#2D5E8B]/60 focus:outline-none focus:border-[#2D5E8B] transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-[#2D5E8B] font-bold leading-relaxed px-2">
                    Providing your age will ensure you get the best Aibo experience, for more details, please visit our <span className="underline cursor-pointer">Privacy Policy</span>.
                  </p>

                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="w-full py-4 px-6 bg-white/20 border-2 border-[#2D5E8B]/30 rounded-[25px] text-[#2D5E8B] font-bold placeholder:text-[#2D5E8B]/60 focus:outline-none focus:border-[#2D5E8B] transition-colors"
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full py-4 px-6 bg-white/20 border-2 border-[#2D5E8B]/30 rounded-[25px] text-[#2D5E8B] font-bold placeholder:text-[#2D5E8B]/60 focus:outline-none focus:border-[#2D5E8B] transition-colors"
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full py-4 px-6 bg-white/20 border-2 border-[#2D5E8B]/30 rounded-[25px] text-[#2D5E8B] font-bold placeholder:text-[#2D5E8B]/60 focus:outline-none focus:border-[#2D5E8B] transition-colors"
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setScreen('HUB')}
                    className="w-full py-4 bg-[#241E45] text-white rounded-[25px] font-black text-base uppercase tracking-widest shadow-[0_4px_0_0_#1a1730] mt-4"
                  >
                    Create Account
                  </motion.button>

                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-[2px] bg-[#2D5E8B]/20" />
                    <span className="text-[#2D5E8B] font-black text-sm">OR</span>
                    <div className="flex-1 h-[2px] bg-[#2D5E8B]/20" />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-[#241E45] text-white rounded-[25px] font-black text-sm uppercase tracking-widest shadow-[0_4px_0_0_#1a1730] flex items-center justify-center gap-3"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
                    </div>
                    Continue with Google
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setScreen('SIGN_IN')}
                    className="w-full py-4 bg-transparent text-[#241E45] border-2 border-[#241E45] rounded-[25px] font-black text-base uppercase tracking-widest shadow-[0_4px_0_0_#241E45]"
                  >
                    Sign In
                  </motion.button>
                </div>

                <div className="text-[10px] text-[#2D5E8B] font-bold opacity-60 text-center py-6">
                  By Signing in into Aibo you Agree to our <span className="underline cursor-pointer hover:opacity-100 transition-opacity">Terms</span> and <span className="underline cursor-pointer hover:opacity-100 transition-opacity">Private Policy</span>
                </div>
              </motion.div>
            )}

            {screen === 'SIGN_IN' && (
              <motion.div 
                key="signin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[90] bg-[#90CAF9] flex flex-col items-center p-8 overflow-y-auto no-scrollbar"
              >
                {/* Phone Input Section */}
                <div className="w-full space-y-3 mt-4">
                  <div className="flex bg-[#4A90E2]/30 rounded-2xl overflow-hidden border border-white/20">
                    <div className="px-4 py-4 bg-[#4A90E2]/40 border-r border-white/20 text-white font-black text-lg">
                      +91
                    </div>
                    <div className="flex-1 flex items-center justify-between px-4">
                      <input 
                        type="tel" 
                        placeholder="" 
                        className="bg-transparent w-full text-white font-black text-lg focus:outline-none"
                      />
                      <button className="text-white font-black text-sm uppercase tracking-wider whitespace-nowrap ml-2">
                        Get Code
                      </button>
                    </div>
                  </div>
                  <div className="bg-[#4A90E2]/30 rounded-2xl p-4 border border-white/20">
                    <input 
                      type="text" 
                      placeholder="VERIFICATION CODE" 
                      className="bg-transparent w-full text-white font-black text-lg placeholder:text-white/60 focus:outline-none uppercase tracking-widest"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setScreen('HUB')}
                    className="w-full py-4 bg-[#262244] text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-[0_4px_0_0_#1a1730] mt-2"
                  >
                    Sign In
                  </motion.button>
                </div>

                {/* Logo Section */}
                <div className="flex flex-col items-center text-center my-8">
                  <h1 className="text-[#28244C] text-5xl font-black tracking-tighter lowercase mb-2">
                    learn
                  </h1>
                  <p className="text-[#28244C] text-[10px] font-bold leading-tight max-w-[180px] opacity-80">
                    The most effective, fun and best way to learn about AI
                  </p>
                </div>

                {/* Social Logins Section */}
                <div className="w-full space-y-3 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-[#4A90E2] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-white/20 shadow-[0_4px_0_0_#3a70b0]"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
                    </div>
                    Sign in with Google
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-[#4A90E2] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-white/20 shadow-[0_4px_0_0_#3a70b0]"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                       <div className="text-[#4A90E2] font-black text-xs">f</div>
                    </div>
                    Sign in with Facebook
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-[#4A90E2] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-white/20 shadow-[0_4px_0_0_#3a70b0]"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                       <Send className="w-3 h-3 text-[#4A90E2]" />
                    </div>
                    Sign in with Email
                  </motion.button>
                </div>

                {/* Footer Section */}
                <div className="text-[9px] text-[#28244C] font-bold opacity-60 text-center pb-4">
                  By Signing in into Aibo you Agree to our <span className="underline cursor-pointer">Terms</span><br />
                  and <span className="underline cursor-pointer">Private Policy</span>
                </div>
              </motion.div>
            )}

            {screen === 'HUB' && (
              <motion.div
                key="hub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#131f24]"
              >
                {/* Scrollable Path */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-8 relative bg-slate-50/30 dark:bg-[#131f24]">
                  {/* Circuit Traces Background */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#2D5E8B 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                  </div>
                  
                  <div className="flex flex-col items-center gap-12 py-6 relative z-10">
                    {/* Section 1 Header */}
                    <div className="w-full bg-brand-primary rounded-[2.5rem] p-8 text-white mb-2 shadow-[0_8px_0_0_#357abd] relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                      <div className="absolute left-0 top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Section 1: The Beginning</h3>
                      <h2 className="text-2xl font-black tracking-tight">AI Foundations</h2>
                      <p className="text-white/70 text-xs font-medium mt-2 max-w-[200px]">Master the basics of machine learning and neural networks.</p>
                    </div>

                    {/* Unit 1 */}
                    <div className="w-full flex flex-col items-center gap-12">
                      <div className="w-full flex items-center gap-4 mb-4">
                        <div className="h-[2px] flex-1 bg-slate-200 dark:bg-[#37464f]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unit 1</span>
                        <div className="h-[2px] flex-1 bg-slate-200 dark:bg-[#37464f]" />
                      </div>

                      {/* Path Nodes */}
                      <div className="relative flex flex-col items-center gap-16 w-full">
                        {/* Node 1 - Active */}
                        <div className="relative flex flex-col items-center gap-4 w-full">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setScreen('LESSON')}
                            className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center shadow-[0_8px_0_0_#357abd] cursor-pointer relative z-10 border-4 border-white dark:border-[#131f24]"
                          >
                            <Star className="w-10 h-10 text-white fill-white" />
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 bg-white rounded-full"
                            />
                          </motion.div>
                          <div className="bg-white dark:bg-[#1f2f36] px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-[#37464f]">
                            <span className="font-black text-[10px] text-brand-primary uppercase tracking-widest">Start Mission</span>
                          </div>
                        </div>

                        {/* Node 2 - Chest */}
                        <div className="relative flex flex-col items-center gap-4 w-full translate-x-12">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCoins(prev => prev + 50);
                              setEnergy(prev => Math.min(100, prev + 20));
                              setShowRewardModal(true);
                            }}
                            className="w-16 h-16 bg-brand-warning rounded-2xl flex items-center justify-center shadow-[0_6px_0_0_#cca000] cursor-pointer relative z-10 border-4 border-white dark:border-[#131f24]"
                          >
                            <Trophy className="w-8 h-8 text-white" />
                          </motion.div>
                          <div className="bg-white dark:bg-[#1f2f36] px-3 py-1.5 rounded-xl border border-slate-100 dark:border-[#37464f]">
                            <span className="font-black text-[8px] text-brand-warning uppercase tracking-widest">Bonus Chest</span>
                          </div>
                        </div>

                        {/* Node 3 - Locked */}
                        <div className="relative flex flex-col items-center gap-4 w-full -translate-x-12">
                          <div className="w-16 h-16 bg-slate-200 dark:bg-[#37464f] rounded-full flex items-center justify-center shadow-[0_6px_0_0_#cbd5e1] dark:shadow-[0_6px_0_0_#131f24] grayscale relative border-4 border-white dark:border-[#131f24]">
                            <X className="w-8 h-8 text-slate-400" />
                          </div>
                          <div className="bg-slate-100 dark:bg-[#1f2f36] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#37464f] opacity-60">
                            <span className="font-black text-[8px] text-slate-400 uppercase tracking-widest">Locked</span>
                          </div>
                        </div>

                        {/* Node 4 - Quiz */}
                        <div className="relative flex flex-col items-center gap-4 w-full">
                          <div className="w-20 h-20 bg-brand-primary/20 dark:bg-brand-primary/10 rounded-full flex items-center justify-center shadow-[0_8px_0_0_#cbd5e1] dark:shadow-[0_8px_0_0_#131f24] grayscale relative border-4 border-white dark:border-[#131f24]">
                            <Trophy className="w-10 h-10 text-slate-400" />
                          </div>
                          <div className="bg-slate-100 dark:bg-[#1f2f36] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#37464f] opacity-60">
                            <span className="font-black text-[8px] text-slate-400 uppercase tracking-widest">Unit 1 Quiz</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Unit 2 */}
                    <div className="w-full flex flex-col items-center gap-12 mt-12">
                      <div className="w-full flex items-center gap-4 mb-4">
                        <div className="h-[2px] flex-1 bg-slate-200 dark:bg-[#37464f]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unit 2</span>
                        <div className="h-[2px] flex-1 bg-slate-200 dark:bg-[#37464f]" />
                      </div>
                      
                      <div className="w-full bg-slate-100 dark:bg-[#1f2f36] rounded-[2.5rem] p-8 text-slate-400 mb-2 border-2 border-dashed border-slate-200 dark:border-[#37464f]">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Section 2: Deep Learning</h3>
                        <h2 className="text-2xl font-black tracking-tight">Neural Networks</h2>
                        <p className="text-slate-400 text-xs font-medium mt-2 max-w-[200px]">Unlock this section by completing Unit 1.</p>
                      </div>

                      {/* Path Nodes for Unit 2 */}
                      <div className="relative flex flex-col items-center gap-16 w-full opacity-40">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-[#37464f] rounded-full flex items-center justify-center shadow-[0_6px_0_0_#cbd5e1] dark:shadow-[0_6px_0_0_#131f24] border-4 border-white dark:border-[#131f24]">
                          <Star className="w-8 h-8 text-slate-400" />
                        </div>
                        <div className="w-16 h-16 bg-slate-200 dark:bg-[#37464f] rounded-full flex items-center justify-center shadow-[0_6px_0_0_#cbd5e1] dark:shadow-[0_6px_0_0_#131f24] border-4 border-white dark:border-[#131f24] translate-x-12">
                          <Star className="w-8 h-8 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}


            {screen === 'LESSON' && (
              <motion.div 
                key="lesson"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col gap-2 min-h-0"
              >
                {/* Main Question */}
                <div className="text-left py-1">
                  <h2 className="text-xl font-black text-brand-primary tracking-tight">
                    {currentLesson.interactiveType === 'flip' 
                      ? currentLesson.interactiveData.front 
                      : "How AI Learns?"}
                  </h2>
                </div>

                {/* Main Interactive Card */}
                <motion.div 
                  className={`flex-1 relative flex flex-col overflow-visible mb-1 min-h-0 ${
                    currentLesson.interactiveType === 'flip' 
                      ? '' 
                      : 'bg-white dark:bg-[#1f2f36] border-2 border-slate-200 dark:border-[#37464f] rounded-[2.5rem] p-5 shadow-[0_4px_0_0_#e5e5e5] dark:shadow-[0_4px_0_0_#131f24]'
                  }`}
                >
                  {currentLesson.interactiveType !== 'flip' && (
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-0.5">{currentLesson.title}</h2>
                        <p className="text-brand-primary text-[9px] font-black uppercase tracking-[0.2em]">{currentLesson.subtitle}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className={`flex-1 ${currentLesson.interactiveType === 'flip' ? '' : 'overflow-y-auto no-scrollbar mb-2'}`}>
                      {/* Interactive Template as the Main Content */}
                      <div className={currentLesson.interactiveType === 'flip' ? 'h-full' : 'min-h-[200px]'}>
                        {currentLesson.interactiveType === 'chat' && (
                          <ChatDialogue 
                            messages={currentLesson.interactiveData} 
                            onComplete={() => setIsInteractiveComplete(true)}
                          />
                        )}
                        {currentLesson.interactiveType === 'analogy' && (
                          <AnalogyCard 
                            data={currentLesson.interactiveData} 
                            onComplete={() => setIsInteractiveComplete(true)}
                          />
                        )}
                        {currentLesson.interactiveType === 'flip' && (
                          <FlipCard 
                            data={currentLesson.interactiveData} 
                            onComplete={() => setIsInteractiveComplete(true)}
                          />
                        )}
                        {currentLesson.interactiveType === 'predict' && (
                          <PredictReveal 
                            data={currentLesson.interactiveData} 
                            onComplete={() => setIsInteractiveComplete(true)}
                          />
                        )}
                        {currentLesson.interactiveType === 'buildup' && (
                          <BuildUpDiagram 
                            steps={currentLesson.interactiveData} 
                            onComplete={() => setIsInteractiveComplete(true)}
                            onNext={handleNext}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <motion.button
                        whileHover={isInteractiveComplete ? { scale: 1.02 } : {}}
                        whileTap={isInteractiveComplete ? { scale: 0.98 } : {}}
                        animate={isInteractiveComplete ? { 
                          scale: [1, 1.02, 1],
                          boxShadow: [
                            '0 4px 0 0 #357abd',
                            '0 4px 15px 0 rgba(74, 144, 226, 0.4)',
                            '0 4px 0 0 #357abd'
                          ]
                        } : {}}
                        transition={isInteractiveComplete ? { 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        } : {}}
                        onClick={handleNext}
                        disabled={!isInteractiveComplete}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-lg ${
                          isInteractiveComplete 
                            ? 'bg-brand-primary text-white border-b-4 border-[#357abd]' 
                            : 'bg-slate-100 dark:bg-[#37464f] text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {currentSection < LESSON_CONTENT.length - 1 ? 'Continue' : 'Finish Training'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {screen === 'PRE_QUIZ' && (
              <motion.div 
                key="pre-quiz"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex-1 flex flex-col gap-4"
              >
                {/* Main Question */}
                <div className="text-left py-2">
                  <h2 className="text-2xl font-black text-brand-primary tracking-tight">How AI Learns?</h2>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
                  <div className="relative">
                    <div className="w-36 h-36 bg-brand-primary/10 rounded-full flex items-center justify-center">
                      <Zap className="w-16 h-16 text-brand-primary" />
                    </div>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-dashed border-brand-primary/20 rounded-full -m-4"
                    />
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Ready for the Mission?</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      You've completed the training! Now it's time to test your AI knowledge and earn your badges.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg border-b-4 border-[#357abd] active:border-b-0 active:translate-y-1"
                  >
                    Start Quiz
                  </motion.button>
                </div>
              </motion.div>
            )}

            {screen === 'QUIZ' && (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col gap-2 min-h-0"
              >
                {/* Main Question - Reduced padding */}
                <div className="text-left py-1">
                  <h2 className="text-xl font-black text-brand-primary tracking-tight">How AI Learns?</h2>
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Quiz Mission</h2>
                  <div className="p-1.5 bg-brand-primary/10 rounded-xl border-2 border-brand-primary/20">
                    <Lightbulb className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>
                
                <div className="flex-1 bg-white dark:bg-[#1f2f36] border-2 border-slate-200 dark:border-[#37464f] rounded-[2rem] p-5 shadow-[0_4px_0_0_#e5e5e5] dark:shadow-[0_4px_0_0_#131f24] relative flex flex-col overflow-hidden min-h-0">
                  <div className="flex gap-3 items-center mb-4">
                    <p className="text-slate-800 dark:text-slate-200 font-bold text-base leading-tight flex-1">{currentQuestion.question}</p>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pr-1 min-h-0">
                    {currentQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full p-3.5 rounded-xl text-left font-bold transition-all border-2 text-sm relative overflow-hidden group ${
                          selectedOption === idx 
                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                            : 'bg-white dark:bg-[#1f2f36] border-slate-200 dark:border-[#37464f] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#37464f]'
                        } ${isAnswered && idx === currentQuestion.correctAnswer ? 'bg-emerald-50 dark:bg-emerald-500/10 border-brand-success text-brand-success' : ''}
                          ${isAnswered && selectedOption === idx && idx !== currentQuestion.correctAnswer ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-400 text-rose-700 dark:text-rose-400' : ''}
                        `}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <span className={`inline-block w-7 h-7 rounded-lg text-center leading-7 font-black text-[10px] ${selectedOption === idx ? 'bg-brand-primary/20' : 'bg-slate-100 dark:bg-[#37464f]'}`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-[12px] leading-tight flex-1">{opt}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Quiz Navigation */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 dark:border-[#37464f]">
                    <button 
                      onClick={handlePrev}
                      className="p-2 rounded-xl text-brand-primary hover:bg-brand-primary/10 active:scale-90 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    {!isAnswered && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={selectedOption === null}
                        onClick={handleNext}
                        className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-b-4 ${
                          selectedOption === null 
                            ? 'bg-slate-100 dark:bg-[#37464f] text-slate-300 dark:text-slate-500 border-slate-200 dark:border-[#37464f] cursor-not-allowed' 
                            : 'bg-brand-primary text-white border-[#357abd]'
                        }`}
                      >
                        Check
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {screen === 'SCORE' && (
              <motion.div 
                key="score"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center px-4 overflow-y-auto no-scrollbar pb-8 bg-white dark:bg-[#131f24]"
              >
                <div className="relative mb-6 mt-8">
                  <div className="w-36 h-36 bg-yellow-400/10 rounded-full flex items-center justify-center">
                    <Trophy className="w-16 h-16 text-yellow-400" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-black text-brand-secondary dark:text-brand-primary mb-1 uppercase italic tracking-tighter leading-none">Mission Complete!</h2>
                <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">AI Fundamentals Mastered</p>
                
                <div className="bg-white dark:bg-[#1f2f36] border-2 border-slate-200 dark:border-[#37464f] rounded-[2rem] p-6 w-full shadow-[0_4px_0_0_#e5e5e5] dark:shadow-[0_4px_0_0_#131f24] mb-4">
                  <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-1">Mastery Score</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{score}</span>
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-black text-brand-primary leading-none">/ {QUIZ_QUESTIONS.length}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Correct</span>
                    </div>
                  </div>
                </div>

                {/* Mission Report */}
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <HelpCircle className="w-4 h-4 text-brand-primary" />
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Mission Report</h3>
                  </div>
                  
                  {incorrectAnswers.length > 0 ? (
                    <div className="space-y-3">
                      {incorrectAnswers.map((q, i) => (
                        <div key={i} className="bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-100 dark:border-rose-500/20 rounded-2xl p-4">
                          <p className="text-rose-700 dark:text-rose-400 font-bold text-[13px] mb-2 leading-tight">{q.question}</p>
                          <div className="flex gap-2">
                            <div className="w-1 h-auto bg-rose-200 dark:bg-rose-500/30 rounded-full shrink-0" />
                            <p className="text-rose-600/80 dark:text-rose-400/80 text-[11px] font-medium leading-relaxed italic">
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-100 dark:border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-800 dark:text-amber-400 font-black text-[10px] uppercase tracking-widest mb-1">Weak Points Detected</p>
                          <p className="text-amber-700/80 dark:text-amber-400/80 text-[11px] font-medium leading-relaxed">
                            {incorrectAnswers.some(q => q.id === 'q1') && "Focus on how AI uses massive datasets to find patterns. "}
                            {incorrectAnswers.some(q => q.id === 'q2') && "Review how 'Weights' act as knobs to prioritize information. "}
                            {incorrectAnswers.some(q => q.id === 'q3') && "Study Backpropagation to understand how AI learns from mistakes. "}
                            {incorrectAnswers.some(q => q.id === 'q4') && "Remember that AI builds its own logic instead of following strict rules. "}
                            {incorrectAnswers.some(q => q.id === 'q5') && "Review the Inference stage to see how AI applies its knowledge. "}
                            {incorrectAnswers.length > 0 && "Try revisiting the training slides to reinforce these concepts!"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-6 text-center">
                      <CheckCircle2 className="w-10 h-10 text-brand-success mx-auto mb-3" />
                      <p className="text-emerald-800 dark:text-emerald-400 font-black text-xs uppercase tracking-widest mb-1">Perfect Execution!</p>
                      <p className="text-emerald-700/80 dark:text-emerald-400/80 text-[11px] font-medium leading-relaxed">
                        You've demonstrated a flawless understanding of AI learning patterns.
                      </p>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('LEADERBOARD')}
                  className="w-full py-4 bg-white dark:bg-[#1f2f36] text-brand-primary rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg border-2 border-brand-primary active:translate-y-1 mt-4"
                >
                  View Leaderboard
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg border-b-4 border-[#357abd] active:border-b-0 active:translate-y-1 mt-4"
                >
                  Keep Learning!
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Bar */}
        {screen !== 'LOADING' && screen !== 'LOGIN' && screen !== 'SIGN_IN' && screen !== 'REGISTER' && screen !== 'HUB' && screen !== 'LEADERBOARD' && (
          <div className="px-6 pb-6 flex flex-col gap-4 relative">
            <AnimatePresence>
              {isAnswered && (
                <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  className={`absolute inset-x-0 bottom-full z-30 flex items-center px-6 py-6 gap-4 ${isCorrect ? 'bg-brand-success' : 'bg-rose-500'} shadow-2xl`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/20">
                    {isCorrect ? <Check className="w-7 h-7 text-white" /> : <AlertCircle className="w-7 h-7 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-white text-lg uppercase tracking-tight leading-none mb-1">
                      {isCorrect ? 'Excellent!' : 'Not Quite'}
                    </p>
                    <p className="text-white/80 text-[12px] font-bold leading-tight">{currentQuestion.explanation}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-b-4 bg-white ${
                      isCorrect ? 'text-brand-success border-emerald-600' : 'text-rose-500 border-rose-700'
                    }`}
                  >
                    {isCorrect ? 'Continue' : 'Got it'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom Navigation - Global for HUB, LEADERBOARD, PROFILE, QUESTS, and SETTINGS */}
        {(screen === 'HUB' || screen === 'LEADERBOARD' || screen === 'PROFILE' || screen === 'QUESTS' || screen === 'SETTINGS') && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-[#37464f] flex items-center justify-around bg-white dark:bg-[#131f24] shadow-[0_-4px_10px_rgba(0,0,0,0.02)] shrink-0">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateTo('HUB')}
              className={`p-3 transition-colors ${screen === 'HUB' ? 'text-brand-primary' : 'text-slate-300 hover:text-brand-primary'}`}
            >
              <Home className={`w-6 h-6 ${screen === 'HUB' ? 'fill-brand-primary' : ''}`} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateTo('QUESTS')}
              className={`p-3 transition-colors ${screen === 'QUESTS' ? 'text-brand-primary' : 'text-slate-300 hover:text-brand-primary'}`}
            >
              <Star className={`w-6 h-6 ${screen === 'QUESTS' ? 'fill-brand-primary' : ''}`} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateTo('LEADERBOARD')}
              className={`p-3 transition-colors ${screen === 'LEADERBOARD' ? 'text-brand-primary' : 'text-slate-300 hover:text-brand-primary'}`}
            >
              <Trophy className={`w-6 h-6 ${screen === 'LEADERBOARD' ? 'fill-brand-primary' : ''}`} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateTo('PROFILE')}
              className={`p-3 transition-colors ${screen === 'PROFILE' ? 'text-brand-primary' : 'text-slate-300 hover:text-brand-primary'}`}
            >
              <User className={`w-6 h-6 ${screen === 'PROFILE' ? 'fill-brand-primary' : ''}`} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateTo('SETTINGS')}
              className={`p-3 transition-colors ${screen === 'SETTINGS' ? 'text-brand-primary' : 'text-slate-300 hover:text-brand-primary'}`}
            >
              <SettingsIcon className={`w-6 h-6 ${screen === 'SETTINGS' ? 'fill-brand-primary' : ''}`} />
            </motion.button>
          </div>
        )}

        {/* Home Indicator */}
        <div className="h-6 flex justify-center items-center bg-white dark:bg-[#131f24]">
          <div className="w-32 h-1.5 bg-slate-200 dark:bg-[#37464f] rounded-full" />
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showBadgeModal && <BadgeModal badge={showBadgeModal} onClose={() => setShowBadgeModal(null)} />}
          {showRewardModal && (
            <RewardModal 
              onClose={() => setShowRewardModal(false)} 
              coins={25}
              xp={100}
            />
          )}
          {showExitModal && (
            <ExitModal 
              onClose={() => setShowExitModal(false)} 
              onExit={() => {
                setShowExitModal(false);
                navigateTo('HUB');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BadgeModal({ badge, onClose }: { badge: string, onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-white dark:bg-[#1f2f36] rounded-[3.5rem] p-10 w-full border-2 border-slate-200 dark:border-[#37464f] text-center shadow-2xl">
        <motion.div 
          animate={{ rotateY: 360, scale: [1, 1.1, 1] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
          className="w-28 h-28 bg-yellow-400 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-lg border-4 border-white dark:border-[#131f24]"
        >
          <Trophy className="w-14 h-14 text-white" />
        </motion.div>
        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mb-2">New Achievement</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">{badge}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed font-medium px-4">
          Great job! You've mastered the core concepts of AI learning.
        </p>
        <button onClick={onClose} className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-lg border-b-4 border-[#357abd] active:border-b-0 active:translate-y-1">Claim Reward</button>
      </motion.div>
    </div>
  );
}

function ExitModal({ onClose, onExit }: { onClose: () => void, onExit: () => void }) {
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative bg-white dark:bg-[#1f2f36] rounded-[3rem] p-10 w-full text-center border-2 border-slate-200 dark:border-[#37464f] shadow-2xl">
        <div className="w-20 h-20 bg-slate-50 dark:bg-[#131f24] rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-slate-100 dark:border-[#37464f]">
          <AlertCircle className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-2xl font-black mb-2 text-slate-900 dark:text-white tracking-tight">Leaving so soon?</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 font-medium">Your progress will be saved right here.</p>
        <div className="flex flex-col gap-3">
          <button onClick={onClose} className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg border-b-4 border-[#357abd] active:border-b-0 active:translate-y-1">Keep Learning</button>
          <button onClick={onExit} className="w-full py-4 bg-transparent text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Exit Mission</button>
        </div>
      </motion.div>
    </div>
  );
}

function RewardModal({ onClose, coins, xp }: { onClose: () => void, coins: number, xp: number }) {
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-white dark:bg-[#1f2f36] rounded-[3.5rem] p-10 w-full border-2 border-slate-200 dark:border-[#37464f] text-center shadow-2xl">
        <motion.div 
          animate={{ rotateY: 360, scale: [1, 1.1, 1] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
          className="w-28 h-28 bg-brand-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-lg border-4 border-white dark:border-[#131f24]"
        >
          <Star className="w-14 h-14 text-white fill-white" />
        </motion.div>
        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mb-2">Mission Complete!</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">Great Work!</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-brand-primary/5 dark:bg-brand-primary/10 rounded-2xl p-4 border border-brand-primary/10 dark:border-brand-primary/20">
            <div className="text-brand-primary font-black text-xl">+{xp}</div>
            <div className="text-[10px] font-black text-brand-primary/60 uppercase tracking-widest">EXP</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-500/10 rounded-2xl p-4 border border-orange-100 dark:border-orange-500/20">
            <div className="text-orange-500 font-black text-xl">+{coins}</div>
            <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">COINS</div>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-lg border-b-4 border-[#357abd] active:border-b-0 active:translate-y-1">Continue</button>
      </motion.div>
    </div>
  );
}
