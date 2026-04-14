import { useState, useEffect } from "react";

const STREAK_KEY = "dsa-dost-streak";

interface StreakData {
  lastVisit: string;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}

interface ComebackMessage {
  show: boolean;
  daysMissed: number;
  message: string;
  motivation: string;
}

const COMEBACK_RESPONSES: Record<string, { reply: string; motivation: string }> = {
  busy: {
    reply: "Arre yaar, busy schedule happens to everyone! 🙌",
    motivation: "Even 10 mins daily is better than nothing. Chal, aaj se phir shuru karte hain!",
  },
  tired: {
    reply: "Rest bhi zaruri hai dost! 😴",
    motivation: "Ab toh fresh feel ho raha hoga. Let's learn something fun today!",
  },
  forgot: {
    reply: "Haha no worries! Main yaad dilata rahunga 😄",
    motivation: "Ab jo time hai use best use karte hain. Ready?",
  },
  confused: {
    reply: "DSA confusing lag sakta hai initially. That's totally normal! 🤗",
    motivation: "Ek ek step karenge, sab clear ho jayega. Trust the process!",
  },
  other: {
    reply: "Life mein kaafi kuch hota hai, I understand! 💙",
    motivation: "Jo bhi reason ho, you're back now. That's what matters!",
  },
};

const getMotivationalMessage = (daysMissed: number): { message: string; motivation: string } => {
  if (daysMissed === 1) {
    return {
      message: "Ek din miss kiya? Koi baat nahi! 🌟",
      motivation: "Consistency build hoti hai slowly. Aaj ka din count karo!",
    };
  } else if (daysMissed <= 3) {
    return {
      message: `${daysMissed} din ho gaye yaar! Kya hua? 🤔`,
      motivation: "Main wait kar raha tha tumhara. Chalo ab saath mein padhte hain!",
    };
  } else if (daysMissed <= 7) {
    return {
      message: `Ek hafte ho gaya almost! Miss kiya tumhe! 😢`,
      motivation: "Koi pressure nahi. Fresh start karte hain aaj se!",
    };
  } else {
    return {
      message: `Bohot din ho gaye dost! Welcome back! 🎉`,
      motivation: "Past chhodo, aaj se naya chapter shuru. Main hoon na tumhare saath!",
    };
  }
};

export const useDailyStreak = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    lastVisit: "",
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
  });
  const [comebackMessage, setComebackMessage] = useState<ComebackMessage>({
    show: false,
    daysMissed: 0,
    message: "",
    motivation: "",
  });
  const [showReasonPicker, setShowReasonPicker] = useState(false);

  useEffect(() => {
    checkAndUpdateStreak();
  }, []);

  const checkAndUpdateStreak = () => {
    try {
      const saved = localStorage.getItem(STREAK_KEY);
      const today = new Date().toDateString();

      if (!saved) {
        // First visit ever
        const newData: StreakData = {
          lastVisit: today,
          currentStreak: 1,
          longestStreak: 1,
          totalDays: 1,
        };
        localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
        setStreakData(newData);
        return;
      }

      const data: StreakData = JSON.parse(saved);
      const lastDate = new Date(data.lastVisit);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day visit
        setStreakData(data);
        return;
      }

      if (diffDays === 1) {
        // Consecutive day
        const newStreak = data.currentStreak + 1;
        const newData: StreakData = {
          lastVisit: today,
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          totalDays: data.totalDays + 1,
        };
        localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
        setStreakData(newData);
      } else {
        // Missed days - show comeback message
        const { message, motivation } = getMotivationalMessage(diffDays);
        setComebackMessage({
          show: true,
          daysMissed: diffDays,
          message,
          motivation,
        });
        setShowReasonPicker(true);

        // Reset streak but keep total
        const newData: StreakData = {
          lastVisit: today,
          currentStreak: 1,
          longestStreak: data.longestStreak,
          totalDays: data.totalDays + 1,
        };
        localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
        setStreakData(newData);
      }
    } catch (err) {
      console.error("Streak tracking error:", err);
    }
  };

  const handleReasonSelect = (reason: string) => {
    const response = COMEBACK_RESPONSES[reason] || COMEBACK_RESPONSES.other;
    setComebackMessage((prev) => ({
      ...prev,
      message: response.reply,
      motivation: response.motivation,
    }));
    setShowReasonPicker(false);
  };

  const dismissComebackMessage = () => {
    setComebackMessage((prev) => ({ ...prev, show: false }));
    setShowReasonPicker(false);
  };

  return {
    streakData,
    comebackMessage,
    showReasonPicker,
    handleReasonSelect,
    dismissComebackMessage,
  };
};
