import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoadmapBuilder from "@/components/RoadmapBuilder";
import GeneratedRoadmap from "@/components/GeneratedRoadmap";
import { useRoadmap } from "@/hooks/useRoadmap";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import type { RoadmapFormData } from "@/components/RoadmapBuilder";

const RoadmapPage = () => {
  const [isReady, setIsReady] = useState(true);
  const navigate = useNavigate();

  const {
    roadmap,
    progress,
    generateRoadmap,
    isGenerating,
    error,
    clearRoadmap,
    toggleWeekComplete,
    toggleTopicComplete,
    getProgressStats,
  } = useRoadmap();

  const handleGenerate = async (data: RoadmapFormData) => {
    await generateRoadmap(data);
    if (error) {
      toast.error(error);
    }
  };

  const handleStartLearning = (topic: string) => {
    navigate(`/?topic=${encodeURIComponent(topic)}`);
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
      <Header onClearChat={() => clearRoadmap()} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
        {roadmap ? (
          <GeneratedRoadmap
            roadmap={roadmap}
            progress={progress}
            onBack={clearRoadmap}
            onStartLearning={handleStartLearning}
            onToggleWeek={toggleWeekComplete}
            onToggleTopic={toggleTopicComplete}
            stats={getProgressStats()}
          />
        ) : (
          <RoadmapBuilder
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        )}

        {error && (
          <div className="max-w-2xl mx-auto mt-4">
            <div className="glass-panel p-4 border-destructive/50 text-destructive text-sm">
              ⚠️ {error}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RoadmapPage;
