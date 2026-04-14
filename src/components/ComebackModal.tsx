import { X, Heart, Zap, Coffee, HelpCircle, MoreHorizontal } from "lucide-react";

interface ComebackModalProps {
  daysMissed: number;
  message: string;
  motivation: string;
  showReasonPicker: boolean;
  onSelectReason: (reason: string) => void;
  onDismiss: () => void;
}

const REASONS = [
  { id: "busy", label: "Busy tha yaar", icon: Zap, emoji: "😅" },
  { id: "tired", label: "Thak gaya tha", icon: Coffee, emoji: "😴" },
  { id: "forgot", label: "Bhul gaya", icon: HelpCircle, emoji: "🙈" },
  { id: "confused", label: "Confuse ho gaya", icon: HelpCircle, emoji: "😵" },
  { id: "other", label: "Kuch aur", icon: MoreHorizontal, emoji: "🤷" },
];

const ComebackModal = ({
  daysMissed,
  message,
  motivation,
  showReasonPicker,
  onSelectReason,
  onDismiss,
}: ComebackModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card p-6 max-w-md w-full relative animate-scale-in">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-3">
            {daysMissed <= 1 ? "👋" : daysMissed <= 3 ? "🤗" : daysMissed <= 7 ? "💙" : "🎉"}
          </div>
          <h2 className="text-xl font-bold mb-2">{message}</h2>
          
          {showReasonPicker ? (
            <p className="text-muted-foreground text-sm">Kya hua tha? Bata do, judge nahi karunga 😊</p>
          ) : (
            <p className="text-muted-foreground">{motivation}</p>
          )}
        </div>

        {showReasonPicker ? (
          <div className="space-y-2">
            {REASONS.map((reason) => (
              <button
                key={reason.id}
                onClick={() => onSelectReason(reason.id)}
                className="w-full glass-panel p-3 flex items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
              >
                <span className="text-xl">{reason.emoji}</span>
                <span>{reason.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="glass-panel p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-secondary mb-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Dost ki baat</span>
              </div>
              <p className="text-sm">{motivation}</p>
            </div>

            <button
              onClick={onDismiss}
              className="w-full btn-primary-glow"
            >
              Chalo shuru karte hain! 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComebackModal;
