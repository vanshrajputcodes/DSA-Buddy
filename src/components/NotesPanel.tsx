import { useState, useRef } from "react";
import { BookOpen, FileText, Bookmark, Download, Loader2, Camera, X, Sparkles, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateNotesPdf } from "@/lib/generateNotesPdf";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  topic: string;
}

const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Arrays - Basics",
    topic: "Arrays",
    content: `📘 Arrays – Notes

→ Array = same type elements
→ Stored in continuous memory
→ Index starts from 0

┌───┬───┬───┬───┐
│10 │20 │30 │40 │
└───┴───┴───┴───┘
 0   1   2   3`,
  },
  {
    id: "2",
    title: "Time Complexity",
    topic: "Basics",
    content: `⏱️ Time Complexity

→ O(1) - Constant
→ O(n) - Linear  
→ O(n²) - Quadratic
→ O(log n) - Logarithmic`,
  },
];

const QUICK_TOPICS = [
  "Arrays Complete Guide",
  "Linked List Deep Dive", 
  "Stack & Queue Mastery",
  "Binary Trees Full Notes",
  "Graph Algorithms",
  "Dynamic Programming",
  "Recursion & Backtracking",
  "Sorting Algorithms"
];

const NotesPanel = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setSelectedTopic("");
      setCustomTopic("");
      toast.success("Image ready for notes! 📸");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = async () => {
    const topic = customTopic.trim() || selectedTopic;
    
    if (!topic && !imagePreview) {
      toast.error("Topic select karo ya image upload karo!");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-notes", {
        body: { 
          topic: topic || "Problem from Screenshot",
          imageData: imagePreview 
        },
      });

      if (error) throw new Error(error.message);

      if (data?.notes) {
        generateNotesPdf(topic || "Screenshot-Notes", data.notes);
        toast.success("Advanced Notes downloaded! 📚✨");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        throw new Error("No notes generated");
      }
    } catch (err) {
      console.error("Notes generation error:", err);
      toast.error("Notes generate nahi ho paye. Try again!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Advanced Notes</h2>
          <p className="text-xs text-muted-foreground font-handwritten">With diagrams & examples</p>
        </div>
      </div>

      {/* FREE Banner */}
      <div className="mx-4 mt-3 p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-green-500 animate-pulse" />
          <div>
            <p className="text-sm font-bold text-green-600">100% FREE! 🎉</p>
            <p className="text-xs text-green-600/80">Limited Time Offer - No limits!</p>
          </div>
        </div>
      </div>

      {/* Download Notes Section */}
      <div className="p-4 border-b border-border/50 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium">📥 Premium PDF Notes</p>
        </div>

        {/* Image Upload for Notes */}
        <div className="relative">
          {imagePreview ? (
            <div className="relative inline-block w-full">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-24 object-cover rounded-lg border border-primary/30"
              />
              <button
                onClick={removeImage}
                className="absolute top-1 right-1 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/80"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs text-center mt-1 text-primary">Problem image ready! ✅</p>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
            >
              <Camera className="w-5 h-5" />
              <span className="text-sm">Upload problem screenshot</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
        
        {/* Quick topic buttons */}
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TOPICS.slice(0, 4).map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setSelectedTopic(topic);
                setImagePreview(null);
              }}
              className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                selectedTopic === topic
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {topic.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Custom topic input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Or type any topic..."
            value={customTopic}
            onChange={(e) => {
              setCustomTopic(e.target.value);
              setSelectedTopic("");
              setImagePreview(null);
            }}
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-muted/50 border border-border/50 focus:border-primary/50 focus:outline-none font-handwritten"
          />
        </div>

        {/* What you get */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">📦 Notes include:</p>
          <p>→ Visual ASCII diagrams</p>
          <p>→ Step-by-step dry runs</p>
          <p>→ Code with explanations</p>
          <p>→ Interview tips & tricks</p>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={isGenerating || (!customTopic.trim() && !selectedTopic && !imagePreview)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Premium Notes...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download FREE Notes PDF ✨
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        <p className="text-xs text-muted-foreground">📝 Sample Notes Preview</p>
        
        {sampleNotes.map((note) => (
          <div key={note.id} className="note-card group cursor-pointer transition-all hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-sm">{note.title}</h3>
              </div>
              <Bookmark className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="inline-block text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary mb-2">
              {note.topic}
            </span>
            <pre className="text-xs font-handwritten text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {note.content}
            </pre>
          </div>
        ))}

        <div 
          className="note-card border-dashed border-2 border-border/50 bg-transparent flex flex-col items-center justify-center py-8 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => document.querySelector<HTMLInputElement>('input[placeholder*="topic"]')?.focus()}
        >
          <FileText className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground font-handwritten">Generate notes for any topic!</p>
          <p className="text-xs text-primary mt-1">100% FREE! 🎁</p>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
