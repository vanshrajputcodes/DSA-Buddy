import { useState } from "react";
import { Map, Sparkles, ChevronRight, Clock, Target, Layers, Loader2 } from "lucide-react";
import { z } from "zod";

const roadmapSchema = z.object({
  level: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select your current level",
  }),
  goal: z.enum(["placements", "competitive", "general", "faang"], {
    required_error: "Please select your goal",
  }),
  dailyTime: z.enum(["30min", "1hr", "2hr", "3hr+"], {
    required_error: "Please select daily time",
  }),
  targetWeeks: z.number().min(4).max(52),
});

export type RoadmapFormData = z.infer<typeof roadmapSchema>;

interface RoadmapBuilderProps {
  onGenerate: (data: RoadmapFormData) => Promise<void>;
  isGenerating: boolean;
}

const levels = [
  { value: "beginner", label: "Beginner", emoji: "🌱", desc: "Just starting coding" },
  { value: "intermediate", label: "Intermediate", emoji: "🌿", desc: "Know basics, some DSA" },
  { value: "advanced", label: "Advanced", emoji: "🌳", desc: "Good DSA, need practice" },
];

const goals = [
  { value: "placements", label: "Campus Placements", emoji: "🎓", desc: "Service & product companies" },
  { value: "faang", label: "FAANG/MAANG", emoji: "🚀", desc: "Top tech companies" },
  { value: "competitive", label: "Competitive Programming", emoji: "🏆", desc: "Contests & ratings" },
  { value: "general", label: "General DSA", emoji: "📚", desc: "Strong fundamentals" },
];

const timeOptions = [
  { value: "30min", label: "30 mins", emoji: "⚡" },
  { value: "1hr", label: "1 hour", emoji: "⏰" },
  { value: "2hr", label: "2 hours", emoji: "🔥" },
  { value: "3hr+", label: "3+ hours", emoji: "💪" },
];

const RoadmapBuilder = ({ onGenerate, isGenerating }: RoadmapBuilderProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RoadmapFormData>>({
    targetWeeks: 12,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelect = (field: keyof RoadmapFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1 && !formData.level) {
      newErrors.level = "Please select your level";
    }
    if (step === 2 && !formData.goal) {
      newErrors.goal = "Please select your goal";
    }
    if (step === 3 && !formData.dailyTime) {
      newErrors.dailyTime = "Please select daily time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 4) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleGenerate = async () => {
    const result = roadmapSchema.safeParse(formData);
    if (result.success) {
      await onGenerate(result.data);
    } else {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
    }
  };

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
          <Map className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h2 className="font-bold text-xl">Build Your Roadmap</h2>
          <p className="text-sm text-muted-foreground">Personalized DSA learning path</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                s === step
                  ? "bg-primary text-primary-foreground scale-110"
                  : s < step
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                  s < step ? "bg-secondary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Level */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">What's your current level?</h3>
          </div>
          <div className="grid gap-3">
            {levels.map((level) => (
              <button
                key={level.value}
                onClick={() => handleSelect("level", level.value)}
                className={`glass-panel p-4 text-left transition-all hover:scale-[1.02] ${
                  formData.level === level.value
                    ? "border-primary/50 bg-primary/10"
                    : "hover:border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{level.emoji}</span>
                  <div>
                    <p className="font-medium">{level.label}</p>
                    <p className="text-sm text-muted-foreground">{level.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.level && (
            <p className="text-sm text-destructive">{errors.level}</p>
          )}
        </div>
      )}

      {/* Step 2: Goal */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">What's your goal?</h3>
          </div>
          <div className="grid gap-3">
            {goals.map((goal) => (
              <button
                key={goal.value}
                onClick={() => handleSelect("goal", goal.value)}
                className={`glass-panel p-4 text-left transition-all hover:scale-[1.02] ${
                  formData.goal === goal.value
                    ? "border-primary/50 bg-primary/10"
                    : "hover:border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.emoji}</span>
                  <div>
                    <p className="font-medium">{goal.label}</p>
                    <p className="text-sm text-muted-foreground">{goal.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.goal && (
            <p className="text-sm text-destructive">{errors.goal}</p>
          )}
        </div>
      )}

      {/* Step 3: Daily Time */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Daily time you can dedicate?</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {timeOptions.map((time) => (
              <button
                key={time.value}
                onClick={() => handleSelect("dailyTime", time.value)}
                className={`glass-panel p-4 text-center transition-all hover:scale-[1.02] ${
                  formData.dailyTime === time.value
                    ? "border-primary/50 bg-primary/10"
                    : "hover:border-border"
                }`}
              >
                <span className="text-2xl block mb-2">{time.emoji}</span>
                <p className="font-medium">{time.label}</p>
              </button>
            ))}
          </div>
          {errors.dailyTime && (
            <p className="text-sm text-destructive">{errors.dailyTime}</p>
          )}
        </div>
      )}

      {/* Step 4: Timeline */}
      {step === 4 && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">How many weeks to complete?</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">4 weeks</span>
              <span className="text-2xl font-bold text-primary">{formData.targetWeeks} weeks</span>
              <span className="text-muted-foreground">52 weeks</span>
            </div>
            <input
              type="range"
              min={4}
              max={52}
              value={formData.targetWeeks}
              onChange={(e) => handleSelect("targetWeeks", parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Summary */}
          <div className="glass-panel p-4 space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Your Summary:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span>📊</span>
                <span>Level: <strong className="text-primary capitalize">{formData.level}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎯</span>
                <span>Goal: <strong className="text-primary capitalize">{formData.goal}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span>⏰</span>
                <span>Time: <strong className="text-primary">{formData.dailyTime}/day</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>Duration: <strong className="text-primary">{formData.targetWeeks} weeks</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            onClick={handleNext}
            className="btn-primary-glow flex items-center gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-secondary-glow flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Roadmap
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default RoadmapBuilder;
