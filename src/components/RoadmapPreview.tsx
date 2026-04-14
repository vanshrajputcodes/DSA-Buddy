import { Map, ChevronRight, CheckCircle2, Circle, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface RoadmapStep {
  id: string;
  title: string;
  status: "completed" | "current" | "locked";
  topics: string[];
}

const roadmapSteps: RoadmapStep[] = [
  {
    id: "1",
    title: "Basics & Fundamentals",
    status: "completed",
    topics: ["Variables", "Data Types", "Loops"],
  },
  {
    id: "2",
    title: "Arrays & Strings",
    status: "current",
    topics: ["1D Arrays", "2D Arrays", "String Ops"],
  },
  {
    id: "3",
    title: "Recursion",
    status: "locked",
    topics: ["Base Cases", "Stack", "Backtracking"],
  },
  {
    id: "4",
    title: "Linked Lists",
    status: "locked",
    topics: ["Singly", "Doubly", "Circular"],
  },
];

const RoadmapPreview = () => {
  const getStatusIcon = (status: RoadmapStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-secondary" />;
      case "current":
        return <Circle className="w-5 h-5 text-primary animate-pulse" />;
      case "locked":
        return <Lock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
          <Map className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h2 className="font-semibold">Your Roadmap</h2>
          <p className="text-xs text-muted-foreground">Personalized DSA path</p>
        </div>
      </div>

      <div className="space-y-4">
        {roadmapSteps.map((step, index) => (
          <div
            key={step.id}
            className={`relative pl-8 ${
              step.status === "locked" ? "opacity-50" : ""
            }`}
          >
            {/* Connector line */}
            {index < roadmapSteps.length - 1 && (
              <div
                className={`absolute left-[9px] top-8 w-0.5 h-full ${
                  step.status === "completed"
                    ? "bg-secondary"
                    : "bg-border"
                }`}
              />
            )}

            {/* Status icon */}
            <div className="absolute left-0 top-1">
              {getStatusIcon(step.status)}
            </div>

            {/* Content */}
            <div
              className={`glass-panel p-4 transition-all ${
                step.status === "current"
                  ? "border-primary/50 animate-glow"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{step.title}</h3>
                {step.status !== "locked" && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {step.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/roadmap"
        className="w-full mt-6 btn-secondary-glow text-sm flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Build Custom Roadmap
      </Link>
    </div>
  );
};

export default RoadmapPreview;
