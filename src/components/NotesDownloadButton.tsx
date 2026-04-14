import { Download, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateNotesPdf } from "@/lib/generateNotesPdf";
import { toast } from "sonner";

interface NotesDownloadButtonProps {
  topic: string;
}

const NotesDownloadButton = ({ topic }: NotesDownloadButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first!");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-notes", {
        body: { topic },
      });

      if (error) throw new Error(error.message);

      if (data?.notes) {
        generateNotesPdf(topic, data.notes);
        toast.success("Notes downloaded! 📚");
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
    <button
      onClick={handleDownload}
      disabled={isGenerating || !topic.trim()}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-sm font-medium hover:from-primary/30 hover:to-secondary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download Notes
        </>
      )}
    </button>
  );
};

export default NotesDownloadButton;
