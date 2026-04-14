import { useState, useEffect } from "react";

const API_KEY_STORAGE_KEY = "dsa_dost_gemini_api_key";

export const useApiKey = () => {
  const [apiKey, setApiKeyState] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKeyState(storedKey);
    }
    setIsLoaded(true);
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  };

  const hasApiKey = Boolean(apiKey);

  return { apiKey, setApiKey, hasApiKey, isLoaded };
};
