import { CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw } from "lucide-react";
import { QuizQuestion as QuizQuestionType, Difficulty } from "@/hooks/useQuizMode";

const DIFFICULTY_BADGES: Record<Difficulty, { label: string; className: string }> = {
  easy: { label: "🌱 Easy", className: "bg-green-500/20 text-green-400" },
  medium: { label: "🔥 Medium", className: "bg-amber-500/20 text-amber-400" },
  hard: { label: "💀 Hard", className: "bg-red-500/20 text-red-400" },
};

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: number | null;
  showResult: boolean;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  score: number;
  answeredQuestions: number;
  totalQuestions: number;
  isComplete: boolean;
  onEndQuiz: () => void;
  isLoading: boolean;
  difficulty: Difficulty;
}

const QuizQuestion = ({
  question,
  selectedAnswer,
  showResult,
  onSelectAnswer,
  onNext,
  score,
  answeredQuestions,
  totalQuestions,
  isComplete,
  onEndQuiz,
  isLoading,
  difficulty,
}: QuizQuestionProps) => {
  const difficultyBadge = DIFFICULTY_BADGES[difficulty];
  if (isComplete) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const emoji = percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : percentage >= 40 ? "💪" : "📚";
    const message =
      percentage >= 80
        ? "Zabardast! Tu toh pro hai! 🔥"
        : percentage >= 60
        ? "Bahut achha! Thoda aur practice aur top ho jayega!"
        : percentage >= 40
        ? "Good try! Aur revision karle, next time pakka!"
        : "Koi nahi, practice se sab hota hai! Keep learning! 💪";

    return (
      <div className="glass-panel p-6 rounded-2xl animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">Quiz Complete! {emoji}</h3>
          <div className="text-4xl font-bold text-primary">
            {score}/{totalQuestions}
          </div>
          <p className="text-muted-foreground">{percentage}% correct</p>
          <p className="text-lg">{message}</p>
          <div className="flex gap-3 justify-center pt-4">
            <button onClick={onEndQuiz} className="btn-secondary flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              New Quiz
            </button>
            <button onClick={onEndQuiz} className="btn-primary-glow flex items-center gap-2">
              Back to Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl animate-fade-in">
      {/* Difficulty badge and Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyBadge.className}`}>
            {difficultyBadge.label}
          </span>
          <span className="text-sm text-muted-foreground">
            Question {answeredQuestions + 1} of {totalQuestions}
          </span>
        </div>
        <span className="text-sm font-medium text-primary">
          Score: {score}/{answeredQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
          style={{ width: `${((answeredQuestions + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold mb-6 leading-relaxed">{question.question}</h3>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctIndex;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => !showResult && onSelectAnswer(index)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-3 ${
                showCorrect
                  ? "bg-green-500/20 border-2 border-green-500"
                  : showWrong
                  ? "bg-red-500/20 border-2 border-red-500"
                  : isSelected
                  ? "bg-primary/20 border-2 border-primary"
                  : "bg-muted/50 border-2 border-transparent hover:border-primary/50 hover:bg-muted"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                  showCorrect
                    ? "bg-green-500 text-white"
                    : showWrong
                    ? "bg-red-500 text-white"
                    : isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted-foreground/20"
                }`}
              >
                {showCorrect ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : showWrong ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </span>
              <span className="flex-1">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div
          className={`mt-6 p-4 rounded-xl ${
            selectedAnswer === question.correctIndex ? "bg-green-500/10" : "bg-amber-500/10"
          }`}
        >
          <p className="text-sm">
            <span className="font-semibold">
              {selectedAnswer === question.correctIndex ? "✅ Sahi jawab!" : "❌ Galat!"}
            </span>{" "}
            {question.explanation}
          </p>
        </div>
      )}

      {/* Next button */}
      {showResult && (
        <button
          onClick={onNext}
          disabled={isLoading}
          className="mt-6 w-full btn-primary-glow flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading...
            </>
          ) : answeredQuestions >= totalQuestions ? (
            <>
              Results Dekho
              <Trophy className="w-4 h-4" />
            </>
          ) : (
            <>
              Next Question
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default QuizQuestion;
