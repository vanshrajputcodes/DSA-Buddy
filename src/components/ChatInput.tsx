import { useState, useRef } from "react";
import { Send, Sparkles, Loader2, Camera, X, Image } from "lucide-react";
import { toast } from "sonner";

interface ChatInputProps {
  onSend: (message: string, imageData?: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const ChatInput = ({ onSend, disabled, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || imagePreview) && !disabled && !isLoading) {
      onSend(message.trim(), imagePreview || undefined);
      setMessage("");
      setImagePreview(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Sirf images upload karo!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image 5MB se chhoti honi chahiye!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      toast.success("Screenshot ready! 📸");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="glass-panel p-2">
        {/* Image Preview */}
        {imagePreview && (
          <div className="relative mb-2 inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-20 rounded-lg border border-primary/30"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all disabled:opacity-50"
            title="Screenshot bhejo"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={imagePreview ? "Image ke baare mein poocho..." : "Sawaal poocho ya screenshot bhejo... 📸"}
              disabled={disabled || isLoading}
              className="w-full input-glass pr-12"
            />
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
          </div>
          <button
            type="submit"
            disabled={(!message.trim() && !imagePreview) || disabled || isLoading}
            className="btn-primary-glow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isLoading ? "Soch raha..." : "Bhejo"}</span>
          </button>
        </div>

        {/* Hint */}
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <Image className="w-3 h-3" />
          Problem ka screenshot bhejo, AI solve karega! 🧠
        </p>
      </div>
    </form>
  );
};

export default ChatInput;
