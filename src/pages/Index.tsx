import { useState, useRef, useEffect } from "react";
import { BookOpen, Sparkles, Brain, MessageCircle, Flame } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WelcomeHero from "@/components/WelcomeHero";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import NotesPanel from "@/components/NotesPanel";
import RoadmapPreview from "@/components/RoadmapPreview";
import QuizStarter from "@/components/QuizStarter";
import QuizQuestion from "@/components/QuizQuestion";
import ComebackModal from "@/components/ComebackModal";
import { useDsaChat } from "@/hooks/useDsaChat";
import { useQuizMode } from "@/hooks/useQuizMode";
import { useDailyStreak } from "@/hooks/useDailyStreak";

const STARTED_KEY = "dsa-dost-started";

const Index = () => {
  const [started, setStarted] = useState(() => {
    return localStorage.getItem(STARTED_KEY) === "true";
  });
  const [showSidebar, setShowSidebar] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [showQuizStarter, setShowQuizStarter] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isLoading, clearMessages } = useDsaChat();
  const {
    quizState,
    isLoading: isQuizLoading,
    startQuiz,
    submitAnswer,
    nextQuestion,
    endQuiz,
    isQuizComplete,
  } = useQuizMode();

  const {
    streakData,
    comebackMessage,
    showReasonPicker,
    handleReasonSelect,
    dismissComebackMessage,
  } = useDailyStreak();

  useEffect(() => {
    // Small delay for smooth loading
    setTimeout(() => setIsReady(true), 100);
  }, []);

  // Save started state to localStorage
  useEffect(() => {
    if (started) {
      localStorage.setItem(STARTED_KEY, "true");
    }
  }, [started]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, imageData?: string) => {
    await sendMessage(content, imageData);
  };

  const handleStartQuiz = async (topic: string, difficulty: "easy" | "medium" | "hard") => {
    setShowQuizStarter(false);
    await startQuiz(topic, difficulty);
  };

  const handleEndQuiz = () => {
    endQuiz();
    setShowQuizStarter(false);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onClearChat={clearMessages} />

      {/* Comeback Modal */}
      {comebackMessage.show && (
        <ComebackModal
          daysMissed={comebackMessage.daysMissed}
          message={comebackMessage.message}
          motivation={comebackMessage.motivation}
          showReasonPicker={showReasonPicker}
          onSelectReason={handleReasonSelect}
          onDismiss={dismissComebackMessage}
        />
      )}

      <main className="flex-1 flex flex-col">
        {!started ? (
          <WelcomeHero onGetStarted={() => setStarted(true)} />
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <aside className={`${showSidebar ? "w-80 lg:w-96" : "w-0"} transition-all duration-300 border-r border-border/50 bg-card/30 overflow-hidden flex-shrink-0 hidden md:block`}>
              <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto custom-scrollbar">
                <NotesPanel />
                <RoadmapPreview />
              </div>
            </aside>

            {/* Chat area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Mode toggle + streak */}
              <div className="flex items-center justify-between p-4 pb-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowQuizStarter(false);
                      if (quizState.isActive) endQuiz();
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      !showQuizStarter && !quizState.isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                  <button
                    onClick={() => {
                      if (!quizState.isActive) {
                        setShowQuizStarter(true);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      showQuizStarter || quizState.isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Brain className="w-4 h-4" />
                    Quiz Mode
                  </button>
                </div>

                {/* Streak badge */}
                {streakData.currentStreak > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-400">{streakData.currentStreak} day streak</span>
                  </div>
                )}
              </div>

              {/* Quiz Mode */}
              {(showQuizStarter || quizState.isActive) && (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
                  <div className="max-w-2xl mx-auto">
                    {showQuizStarter && !quizState.isActive ? (
                      <QuizStarter onStartQuiz={handleStartQuiz} isLoading={isQuizLoading} />
                    ) : quizState.currentQuestion ? (
                      <QuizQuestion
                        question={quizState.currentQuestion}
                        selectedAnswer={quizState.selectedAnswer}
                        showResult={quizState.showResult}
                        onSelectAnswer={submitAnswer}
                        onNext={nextQuestion}
                        score={quizState.score}
                        answeredQuestions={quizState.answeredQuestions}
                        totalQuestions={quizState.totalQuestions}
                        isComplete={isQuizComplete}
                        onEndQuiz={handleEndQuiz}
                        isLoading={isQuizLoading}
                        difficulty={quizState.difficulty}
                      />
                    ) : isQuizLoading ? (
                      <div className="glass-panel p-6 rounded-2xl text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                          <Brain className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                        <p className="text-muted-foreground">Question load ho raha hai... 🧠</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Chat Mode */}
              {!showQuizStarter && !quizState.isActive && (
                <>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-6">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message.content} isAI={message.isAI} timestamp={message.timestamp} imageData={message.imageData} />
                    ))}
                    {isLoading && (
                      <div className="flex items-center gap-3 animate-fade-in">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border/50">
                          <BookOpen className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-md">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 md:p-6 border-t border-border/50 bg-background/50 backdrop-blur-sm">
                    <div className="max-w-3xl mx-auto">
                      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
