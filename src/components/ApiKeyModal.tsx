import { useState } from "react";
import { X, Key, ExternalLink, Eye, EyeOff, Check } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSave: (key: string) => void;
}

const ApiKeyModal = ({ isOpen, onClose, currentKey, onSave }: ApiKeyModalProps) => {
  const [key, setKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(key);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleRemove = () => {
    setKey("");
    onSave("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="glass-card p-6 w-full max-w-md relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Gemini API Key</h2>
            <p className="text-sm text-muted-foreground">Free AI-powered learning</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="AIza..."
                className="w-full input-glass pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="glass-panel p-4 space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              🔐 How to get your free API key:
            </h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Go to Google AI Studio</li>
              <li>Sign in with your Google account</li>
              <li>Click "Get API Key"</li>
              <li>Create a new key and paste it here</li>
            </ol>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-2"
            >
              Get API Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            🔒 Your key is stored locally on this device only. We never send it to our servers.
          </p>

          <div className="flex gap-3">
            {currentKey && (
              <button
                onClick={handleRemove}
                className="flex-1 py-3 rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
              >
                Remove Key
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!key.trim()}
              className={`flex-1 btn-primary-glow flex items-center justify-center gap-2 ${
                !key.trim() ? "opacity-50 cursor-not-allowed" : ""
              } ${saved ? "bg-secondary" : ""}`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                "Save Key"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
