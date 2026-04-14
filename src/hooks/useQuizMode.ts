import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizState {
  isActive: boolean;
  currentQuestion: QuizQuestion | null;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  selectedAnswer: number | null;
  showResult: boolean;
  topic: string;
  difficulty: Difficulty;
}

const QUIZ_STORAGE_KEY = "dsa-dost-quiz-state";

const DIFFICULTY_PROMPTS: Record<Difficulty, string> = {
  easy: "beginner level, testing basic understanding with simple concepts. Focus on definitions, basic syntax, and simple operations.",
  medium: "interview level, testing practical understanding with moderate complexity. Include time/space complexity and common patterns.",
  hard: "advanced level, testing deep understanding with complex scenarios. Include edge cases, optimization, and tricky concepts.",
};

const loadQuizState = (): QuizState => {
  try {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load quiz state:", error);
    localStorage.removeItem(QUIZ_STORAGE_KEY);
  }
  return {
    isActive: false,
    currentQuestion: null,
    score: 0,
    totalQuestions: 0,
    answeredQuestions: 0,
    selectedAnswer: null,
    showResult: false,
    topic: "",
    difficulty: "medium",
  };
};

export const useQuizMode = () => {
  const [quizState, setQuizState] = useState<QuizState>(() => loadQuizState());
  const [isLoading, setIsLoading] = useState(false);

  // Save quiz state to localStorage
  useEffect(() => {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizState));
  }, [quizState]);

  const startQuiz = async (topic: string, difficulty: Difficulty = "medium") => {
    setIsLoading(true);
    setQuizState((prev) => ({
      ...prev,
      isActive: true,
      topic,
      difficulty,
      score: 0,
      totalQuestions: 5,
      answeredQuestions: 0,
      selectedAnswer: null,
      showResult: false,
    }));

    await fetchNextQuestion(topic, difficulty);
  };

  const fetchNextQuestion = async (topic: string, difficulty: Difficulty) => {
    setIsLoading(true);
    try {
      const difficultyDescription = DIFFICULTY_PROMPTS[difficulty];
      
      const { data, error } = await supabase.functions.invoke("dsa-chat", {
        body: {
          messages: [
            {
              role: "user",
              content: `Generate a MCQ quiz question about "${topic}" in DSA. 
              
Difficulty: ${difficulty.toUpperCase()} - ${difficultyDescription}

Return ONLY a valid JSON object in this exact format, no extra text:
{
  "question": "Your question here in Hinglish?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Brief explanation in Hinglish why this is correct"
}`,
            },
          ],
          quizMode: true,
        },
      });

      if (error) throw new Error(error.message);

      // Parse the response - it should be JSON
      let questionData;
      try {
        // Try to extract JSON from the response
        const responseText = data.response;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          questionData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.error("Failed to parse quiz response:", parseError);
        // Fallback question
        questionData = {
          question: `${topic} ke baare mein kya sahi hai? (${difficulty})`,
          options: [
            "Option A - Ye sahi hai",
            "Option B - Ye galat hai",
            "Option C - Ye bhi galat hai",
            "Option D - Ye bhi galat hai",
          ],
          correctIndex: 0,
          explanation: "Pehla option sahi hai kyunki...",
        };
      }

      const question: QuizQuestion = {
        id: Date.now().toString(),
        question: questionData.question,
        options: questionData.options,
        correctIndex: questionData.correctIndex,
        explanation: questionData.explanation,
        topic,
      };

      setQuizState((prev) => ({
        ...prev,
        currentQuestion: question,
        selectedAnswer: null,
        showResult: false,
      }));
    } catch (error) {
      console.error("Failed to fetch quiz question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = (answerIndex: number) => {
    if (quizState.selectedAnswer !== null || !quizState.currentQuestion) return;

    const isCorrect = answerIndex === quizState.currentQuestion.correctIndex;

    setQuizState((prev) => ({
      ...prev,
      selectedAnswer: answerIndex,
      showResult: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      answeredQuestions: prev.answeredQuestions + 1,
    }));
  };

  const nextQuestion = async () => {
    if (quizState.answeredQuestions >= quizState.totalQuestions) {
      // Quiz completed
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: null,
      }));
      return;
    }

    await fetchNextQuestion(quizState.topic, quizState.difficulty);
  };

  const endQuiz = () => {
    setQuizState({
      isActive: false,
      currentQuestion: null,
      score: 0,
      totalQuestions: 0,
      answeredQuestions: 0,
      selectedAnswer: null,
      showResult: false,
      topic: "",
      difficulty: "medium",
    });
    localStorage.removeItem(QUIZ_STORAGE_KEY);
  };

  const isQuizComplete = quizState.answeredQuestions >= quizState.totalQuestions && quizState.showResult;

  return {
    quizState,
    isLoading,
    startQuiz,
    submitAnswer,
    nextQuestion,
    endQuiz,
    isQuizComplete,
  };
};
