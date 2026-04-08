import { LessonSection, QuizQuestion, Section, Quest } from "./types";

export const LESSON_CONTENT: LessonSection[] = [
  {
    title: "The Data Diet",
    subtitle: "What AI eats to get smart",
    content: "",
    interactiveType: 'chat',
    interactiveData: [
      { role: 'mentor', text: "Hey! Do you know how I learned to recognize your face?" },
      { role: 'student', text: "By looking at me once?" },
      { role: 'mentor', text: "Nope! I had to see thousands of faces first. It's like how you learn a song by hearing it 100 times!" }
    ]
  },
  {
    title: "Digital Brains",
    subtitle: "Building a Neural Network",
    content: "",
    interactiveType: 'buildup',
    interactiveData: [
      { label: "1. Input", description: "AI sees raw pixels of a photo." },
      { label: "2. Patterns", description: "Hidden layers find edges and shapes." },
      { label: "3. Result", description: "The final layer shouts: 'It's a Cat!'" }
    ]
  },
  {
    title: "The Guessing Game",
    subtitle: "Learning from mistakes",
    content: "",
    interactiveType: 'predict',
    interactiveData: {
      scenario: "The system sees a muffin and guesses it's a 'Chihuahua'. What happens next?",
      options: ["The system gets a treat", "The system is told it's wrong and fixes its math", "The system deletes the picture"],
      correctAnswer: 1,
      revealText: "Correct! This is 'Backpropagation'. The system learns from the error and gets smarter instantly!"
    }
  },
  {
    title: "Tuning the Knobs",
    subtitle: "Weights & Biases",
    content: "",
    interactiveType: 'analogy',
    interactiveData: {
      metaphor: "AI is like learning to ride a bike.",
      explanation: "At first, you wobble. Every time you lean too far, your brain adjusts your balance. That's exactly how AI tunes its 'Weights'!",
      emoji: "🚲"
    }
  },
  {
    title: "Hidden Connections",
    subtitle: "Pattern Recognition",
    content: "",
    interactiveType: 'flip',
    interactiveData: {
      front: "Can AI predict the weather better than humans?",
      back: "Yes! By finding patterns in millions of past storms, AI can spot a hurricane before it even forms!"
    }
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the primary way AI learns to identify objects?",
    options: ["Reading a dictionary", "Analyzing massive datasets", "Watching TV", "Asking a human"],
    correctAnswer: 1,
    explanation: "AI needs millions of examples (data) to build its internal understanding of patterns!"
  },
  {
    id: "q2",
    question: "What are 'Weights' in a neural network?",
    options: ["The physical heaviness of the computer", "Mathematical values that determine importance", "The number of users on an app", "A type of AI battery"],
    correctAnswer: 1,
    explanation: "Weights are the 'knobs' AI turns to prioritize certain features over others during learning!"
  },
  {
    id: "q3",
    question: "What is 'Backpropagation' used for in AI training?",
    options: ["Sending data to the cloud", "Telling the AI how far off its guess was", "Deleting old photos", "Speeding up the internet"],
    correctAnswer: 1,
    explanation: "Backpropagation is like a game of 'Hot or Cold' that helps the AI learn from its mistakes!"
  },
  {
    id: "q4",
    question: "How does AI differ from traditional computer programs?",
    options: ["It's much more expensive", "It follows strict 'If/Then' rules", "It builds its own internal logic from patterns", "It doesn't need electricity"],
    correctAnswer: 2,
    explanation: "Unlike traditional code, AI discovers its own hidden connections in data!"
  },
  {
    id: "q5",
    question: "What happens during the 'Inference' stage of AI?",
    options: ["The AI is being built", "The AI applies its knowledge to new data", "The AI is being deleted", "The AI is taking a break"],
    correctAnswer: 1,
    explanation: "Inference is the 'real-world test' where the AI uses what it learned to make decisions!"
  }
];

export const SECTIONS: Section[] = [
  {
    id: "s1",
    title: "Foundations of AI",
    description: "Master the basics of machine learning and neural networks.",
    color: "#58cc02",
    units: [
      { id: "u1", title: "The Data Diet", type: "lesson", status: "available", lessons: [LESSON_CONTENT[0]] },
      { id: "u2", title: "Digital Brains", type: "lesson", status: "locked", lessons: [LESSON_CONTENT[1]] },
      { id: "u3", title: "The Guessing Game", type: "lesson", status: "locked", lessons: [LESSON_CONTENT[2]] },
      { id: "u4", title: "Tuning the Knobs", type: "lesson", status: "locked", lessons: [LESSON_CONTENT[3]] },
      { id: "c1", title: "Treasure Chest", type: "chest", status: "locked" },
    ]
  },
  {
    id: "s2",
    title: "Neural Architectures",
    description: "Deep dive into how layers communicate.",
    color: "#ce82ff",
    units: [
      { id: "u5", title: "Hidden Connections", type: "lesson", status: "locked", lessons: [LESSON_CONTENT[4]] },
      { id: "u6", title: "Deep Learning", type: "quiz", status: "locked", questions: QUIZ_QUESTIONS },
      { id: "u7", title: "Transformers", type: "lesson", status: "locked" },
      { id: "u8", title: "Attention Mechanism", type: "lesson", status: "locked" },
      { id: "c2", title: "Grand Reward", type: "chest", status: "locked" },
    ]
  }
];

export const QUESTS: Quest[] = [
  {
    id: "q1",
    title: "Early Bird",
    description: "Complete 2 lessons before 9 AM",
    rewardXp: 50,
    rewardGems: 10,
    progress: 1,
    total: 2,
    isCompleted: false,
    icon: "🌅"
  },
  {
    id: "q2",
    title: "Perfect Streak",
    description: "Get 10 questions right in a row",
    rewardXp: 100,
    rewardGems: 25,
    progress: 7,
    total: 10,
    isCompleted: false,
    icon: "🔥"
  },
  {
    id: "q3",
    title: "AI Enthusiast",
    description: "Complete Unit 1",
    rewardXp: 200,
    rewardGems: 50,
    progress: 0,
    total: 1,
    isCompleted: false,
    icon: "🤖"
  }
];
