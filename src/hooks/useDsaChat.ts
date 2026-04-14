import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: string;
  imageData?: string;
}

const STORAGE_KEY = "dsa-dost-chat-history";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  content: `Hey! 👋 Main hoon tera DSA Dost! 

Mujhe bata, tu kahan se start karna chahta hai? Agar bilkul beginner hai, toh tension mat le — hum zero se shuru karenge.

Kuch options:
🔹 "DSA kya hota hai?" — Basics se shuru
🔹 "Arrays sikhao" — Specific topic
🔹 Screenshot bhej — Problem solve karunga
🔹 "Mera roadmap banao" — Custom plan

📸 TIP: Problem ka screenshot bhej sakta hai!

Bol, kaise madad karun? 😊`,
  isAI: true,
  timestamp: formatTime(new Date()),
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const loadMessagesFromStorage = (): Message[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load chat history:", error);
    localStorage.removeItem(STORAGE_KEY);
  }
  return [{ ...WELCOME_MESSAGE, timestamp: formatTime(new Date()) }];
};

const saveMessagesToStorage = (messages: Message[]) => {
  try {
    // Don't save image data to storage (too large)
    const messagesToSave = messages.map(m => ({
      ...m,
      imageData: undefined
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
  } catch (error) {
    console.error("Failed to save chat history:", error);
  }
};

export const useDsaChat = () => {
  const [messages, setMessages] = useState<Message[]>(() => loadMessagesFromStorage());
  const [isLoading, setIsLoading] = useState(false);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);

  const sendMessage = async (content: string, imageData?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: imageData ? (content || "📸 Screenshot bheja") : content,
      isAI: false,
      timestamp: formatTime(new Date()),
      imageData,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare messages for API
      const chatHistory = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => {
          if (m.imageData) {
            return {
              role: m.isAI ? "assistant" : "user",
              content: [
                { type: "text", text: m.content },
                { type: "image_url", image_url: { url: m.imageData } }
              ]
            };
          }
          return {
            role: m.isAI ? "assistant" : "user",
            content: m.content,
          };
        });

      // Add current message
      if (imageData) {
        chatHistory.push({
          role: "user",
          content: [
            { type: "text", text: content || "Is problem ko solve karo aur samjhao" },
            { type: "image_url", image_url: { url: imageData } }
          ]
        });
      } else {
        chatHistory.push({ role: "user", content });
      }

      const { data, error } = await supabase.functions.invoke("dsa-chat", {
        body: { messages: chatHistory },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isAI: true,
        timestamp: formatTime(new Date()),
      };

      setMessages((prev) => [...prev, aiMessage]);
      return { success: true };
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      
      // Add error message to chat
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `⚠️ ${errorMessage}\n\nThoda wait karo aur phir try karo!`,
        isAI: true,
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, errorResponse]);
      
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    const freshWelcome = { ...WELCOME_MESSAGE, timestamp: formatTime(new Date()) };
    setMessages([freshWelcome]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { messages, sendMessage, isLoading, clearMessages };
};
