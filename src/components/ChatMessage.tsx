import { Bot, User, Image } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isAI: boolean;
  timestamp?: string;
  imageData?: string;
}

const ChatMessage = ({ message, isAI, timestamp, imageData }: ChatMessageProps) => {
  return (
    <div
      className={`flex gap-3 animate-fade-in ${
        isAI ? "justify-start" : "justify-end"
      }`}
    >
      {isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center">
          <Bot className="w-5 h-5 text-secondary" />
        </div>
      )}
      
      <div className={isAI ? "chat-bubble-ai" : "chat-bubble-user"}>
        {/* Show image if present */}
        {imageData && (
          <div className="mb-2">
            <div className="relative inline-block">
              <img 
                src={imageData} 
                alt="Uploaded screenshot" 
                className="max-w-[200px] max-h-[150px] rounded-lg border border-border/50 object-contain"
              />
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/50 flex items-center gap-1">
                <Image className="w-3 h-3 text-white" />
                <span className="text-[10px] text-white">Screenshot</span>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-2 block">
            {timestamp}
          </span>
        )}
      </div>

      {!isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
