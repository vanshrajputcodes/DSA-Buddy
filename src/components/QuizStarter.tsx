import { useState } from "react";
import { Brain, Zap, Code, TreePine, GitBranch, Layers } from "lucide-react";

interface QuizStarterProps {
  onStartQuiz: (topic: string, difficulty: "easy" | "medium" | "hard") => void;
  isLoading: boolean;
}

const QUIZ_TOPICS = [
  { id: "arrays", label: "Arrays", icon: Layers, color: "from-blue-500 to-cyan-500" },
  { id: "strings", label: "Strings", icon: Code, color: "from-green-500 to-emerald-500" },
  { id: "linked-lists", label: "Linked Lists", icon: GitBranch, color: "from-purple-500 to-violet-500" },
  { id: "trees", label: "Trees & BST", icon: TreePine, color: "from-amber-500 to-orange-500" },
  { id: "recursion", label: "Recursion", icon: Zap, color: "from-pink-500 to-rose-500" },
  { id: "dynamic-programming", label: "Dynamic Programming", icon: Brain, color: "from-indigo-500 to-blue-500" },
];

const DIFFICULTY_OPTIONS = [
  { id: "easy" as const, label: "Easy", emoji: "🌱", description: "Basics & fundamentals" },
  { id: "medium" as const, label: "Medium", emoji: "🔥", description: "Interview level" },
  { id: "hard" as const, label: "Hard", emoji: "💀", description: "Advanced concepts" },
];

const QuizStarter = ({ onStartQuiz, isLoading }: QuizStarterProps) => {
  const [customTopic, setCustomTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      onStartQuiz(customTopic.trim(), selectedDifficulty);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Quiz Mode 🎯</h3>
        <p className="text-muted-foreground text-sm">
          Difficulty choose karo, topic select karo, aur 5 MCQs solve karo!
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-3 text-center">Difficulty Level</p>
        <div className="flex gap-2">
          {DIFFICULTY_OPTIONS.map((diff) => (
            <button
              key={diff.id}
              onClick={() => setSelectedDifficulty(diff.id)}
              className={`flex-1 p-3 rounded-xl transition-all duration-300 text-center ${
                selectedDifficulty === diff.id
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              <span className="text-xl block mb-1">{diff.emoji}</span>
              <span className="text-sm font-medium block">{diff.label}</span>
              <span className="text-xs opacity-70 block">{diff.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {QUIZ_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onStartQuiz(topic.label, selectedDifficulty)}
            disabled={isLoading}
            className={`p-4 rounded-xl bg-gradient-to-br ${topic.color} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 flex flex-col items-center gap-2 group hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
          >
            <topic.icon className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-white/90">{topic.label}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-border/50" />
        <span className="relative bg-card px-3 text-xs text-muted-foreground mx-auto block w-fit">
          ya custom topic likho
        </span>
      </div>

      <form onSubmit={handleCustomSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          placeholder="e.g., Stack, Graphs, Hashing..."
          className="flex-1 input-glass"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!customTopic.trim() || isLoading}
          className="btn-primary-glow disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Start"}
        </button>
      </form>
    </div>
  );
};

export default QuizStarter;
