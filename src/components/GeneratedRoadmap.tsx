import { CheckCircle2, Circle, Clock, BookOpen, Code, Trophy, ArrowLeft, Download, Share2 } from "lucide-react";
import type { RoadmapProgress } from "@/hooks/useRoadmap";

export interface RoadmapWeek {
  week: number;
  title: string;
  topics: string[];
  practiceProblems: number;
  milestone?: string;
}

export interface GeneratedRoadmapData {
  title: string;
  totalWeeks: number;
  dailyTime: string;
  weeks: RoadmapWeek[];
  tips: string[];
}

interface GeneratedRoadmapProps {
  roadmap: GeneratedRoadmapData;
  progress: RoadmapProgress;
  onBack: () => void;
  onStartLearning: (topic: string) => void;
  onToggleWeek: (week: number) => void;
  onToggleTopic: (topic: string) => void;
  stats: { weeksDone: number; totalWeeks: number; topicsDone: number; totalTopics: number };
}

const GeneratedRoadmap = ({
  roadmap,
  progress,
  onBack,
  onStartLearning,
  onToggleWeek,
  onToggleTopic,
  stats,
}: GeneratedRoadmapProps) => {
  const progressPercent = stats.totalWeeks > 0 ? Math.round((stats.weeksDone / stats.totalWeeks) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Build New Roadmap
          </button>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2 gradient-text">{roadmap.title}</h1>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Your Progress</span>
            <span className="text-primary font-medium">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span>✅ {stats.weeksDone}/{stats.totalWeeks} weeks</span>
            <span>📚 {stats.topicsDone}/{stats.totalTopics} topics</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {roadmap.totalWeeks} weeks
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {roadmap.dailyTime} daily
          </span>
          <span className="flex items-center gap-1">
            <Code className="w-4 h-4" />
            {roadmap.weeks.reduce((acc, w) => acc + w.practiceProblems, 0)}+ problems
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4 mb-6">
        {roadmap.weeks.map((week, index) => {
          const isWeekComplete = progress.completedWeeks.includes(week.week);

          return (
            <div
              key={week.week}
              className="relative pl-8 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Connector */}
              {index < roadmap.weeks.length - 1 && (
                <div className={`absolute left-[11px] top-10 w-0.5 h-full ${isWeekComplete ? 'bg-secondary' : 'bg-border'}`} />
              )}

              {/* Status Icon - clickable */}
              <button
                onClick={() => onToggleWeek(week.week)}
                className="absolute left-0 top-2 hover:scale-110 transition-transform"
                title={isWeekComplete ? "Mark as incomplete" : "Mark as complete"}
              >
                {isWeekComplete ? (
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                ) : index === 0 && progress.completedWeeks.length === 0 ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-pulse">
                    <Circle className="w-3 h-3 text-primary-foreground fill-current" />
                  </div>
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>

              {/* Content */}
              <div className={`glass-panel p-4 transition-all group ${isWeekComplete ? 'border-secondary/30 bg-secondary/5' : 'hover:border-primary/30'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isWeekComplete ? 'text-secondary bg-secondary/10' : 'text-primary bg-primary/10'}`}>
                      Week {week.week}
                    </span>
                    <h3 className="font-semibold mt-2">{week.title}</h3>
                  </div>
                  {week.milestone && (
                    <div className="flex items-center gap-1 text-secondary text-sm">
                      <Trophy className="w-4 h-4" />
                      <span>{week.milestone}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {week.topics.map((topic) => {
                    const isTopicComplete = progress.completedTopics.includes(topic);

                    return (
                      <button
                        key={topic}
                        onClick={() => onToggleTopic(topic)}
                        className={`text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                          isTopicComplete
                            ? 'bg-secondary/20 text-secondary line-through'
                            : 'bg-muted/50 text-muted-foreground hover:bg-primary/20 hover:text-primary'
                        }`}
                        title={isTopicComplete ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {isTopicComplete && <CheckCircle2 className="w-3 h-3" />}
                        {topic}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    📝 {week.practiceProblems} practice problems
                  </span>
                  <button
                    onClick={() => onStartLearning(week.topics[0])}
                    className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Start Learning →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">💡</span>
          Pro Tips for Success
        </h3>
        <ul className="space-y-2">
          {roadmap.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GeneratedRoadmap;
