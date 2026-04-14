import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RoadmapFormData } from "@/components/RoadmapBuilder";
import type { GeneratedRoadmapData } from "@/components/GeneratedRoadmap";

const ROADMAP_STORAGE_KEY = "dsa-dost-roadmap";
const PROGRESS_STORAGE_KEY = "dsa-dost-roadmap-progress";

export interface RoadmapProgress {
  completedWeeks: number[];
  completedTopics: string[];
  startedAt: string;
  lastUpdatedAt: string;
}

export const useRoadmap = () => {
  const [roadmap, setRoadmap] = useState<GeneratedRoadmapData | null>(null);
  const [progress, setProgress] = useState<RoadmapProgress>({
    completedWeeks: [],
    completedTopics: [],
    startedAt: "",
    lastUpdatedAt: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedRoadmap = localStorage.getItem(ROADMAP_STORAGE_KEY);
      const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);

      if (savedRoadmap) {
        setRoadmap(JSON.parse(savedRoadmap));
      }

      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (err) {
      console.error("Failed to load roadmap from storage:", err);
    }
  }, []);

  // Save roadmap to localStorage
  const saveRoadmap = (data: GeneratedRoadmapData) => {
    try {
      localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("Failed to save roadmap:", err);
    }
  };

  // Save progress to localStorage
  const saveProgress = (newProgress: RoadmapProgress) => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newProgress));
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
  };

  const generateRoadmap = async (formData: RoadmapFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-roadmap", {
        body: formData,
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const newRoadmap = data.roadmap;
      setRoadmap(newRoadmap);
      saveRoadmap(newRoadmap);

      // Initialize fresh progress
      const newProgress: RoadmapProgress = {
        completedWeeks: [],
        completedTopics: [],
        startedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      };
      setProgress(newProgress);
      saveProgress(newProgress);
    } catch (err) {
      console.error("Roadmap generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate roadmap");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleWeekComplete = (weekNumber: number) => {
    const newProgress = { ...progress };
    const index = newProgress.completedWeeks.indexOf(weekNumber);

    if (index > -1) {
      newProgress.completedWeeks.splice(index, 1);
    } else {
      newProgress.completedWeeks.push(weekNumber);
    }

    newProgress.lastUpdatedAt = new Date().toISOString();
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const toggleTopicComplete = (topic: string) => {
    const newProgress = { ...progress };
    const index = newProgress.completedTopics.indexOf(topic);

    if (index > -1) {
      newProgress.completedTopics.splice(index, 1);
    } else {
      newProgress.completedTopics.push(topic);
    }

    newProgress.lastUpdatedAt = new Date().toISOString();
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const clearRoadmap = () => {
    setRoadmap(null);
    setError(null);
    setProgress({
      completedWeeks: [],
      completedTopics: [],
      startedAt: "",
      lastUpdatedAt: "",
    });
    localStorage.removeItem(ROADMAP_STORAGE_KEY);
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  };

  const getProgressStats = () => {
    if (!roadmap) return { weeksDone: 0, totalWeeks: 0, topicsDone: 0, totalTopics: 0 };

    const totalTopics = roadmap.weeks.reduce((acc, w) => acc + w.topics.length, 0);

    return {
      weeksDone: progress.completedWeeks.length,
      totalWeeks: roadmap.totalWeeks,
      topicsDone: progress.completedTopics.length,
      totalTopics,
    };
  };

  return {
    roadmap,
    progress,
    generateRoadmap,
    isGenerating,
    error,
    clearRoadmap,
    toggleWeekComplete,
    toggleTopicComplete,
    getProgressStats,
  };
};
