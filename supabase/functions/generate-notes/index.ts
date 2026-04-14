import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADVANCED_NOTES_PROMPT = `You are an expert DSA notes generator creating PREMIUM QUALITY study notes.

🎯 CREATE COMPREHENSIVE NOTES WITH:

📐 VISUAL DIAGRAMS (MANDATORY):
→ Draw ASCII art diagrams for every concept
→ Show step-by-step visual transformations
→ Memory layout diagrams
→ Tree/Graph structures using box characters

Example ASCII Diagram:
┌───┬───┬───┬───┬───┐
│ 5 │ 2 │ 8 │ 1 │ 9 │  Original Array
└───┴───┴───┴───┴───┘
      ↓ Sorting
┌───┬───┬───┬───┬───┐
│ 1 │ 2 │ 5 │ 8 │ 9 │  Sorted Array
└───┴───┴───┴───┴───┘

📚 STRUCTURE (Follow Exactly):

📘 [TOPIC NAME] - Complete Notes

🎯 What & Why?
→ Definition in simple words
→ Real-life example (relatable)
→ Why is this important?

🧠 Core Concept
→ Main idea explained simply
→ ASCII diagram showing the concept
→ Step-by-step breakdown

💻 Implementation
→ Pseudo code first
→ Clean code with comments
→ Line-by-line explanation

📊 Visual Walkthrough
→ ASCII diagram showing each step
→ Input → Process → Output shown visually
→ Dry run with example

⏱️ Complexity Analysis
→ Time: Best, Average, Worst
→ Space complexity
→ When to use vs alternatives

🔥 Common Patterns
→ 3-4 important variations
→ Interview tricks
→ Edge cases to remember

💡 Pro Tips
→ Memory tricks
→ Common mistakes to avoid
→ Interview shortcuts

✅ Practice Problems
→ Easy: [Problem name]
→ Medium: [Problem name]  
→ Hard: [Problem name]

FORMATTING RULES:
→ Use → for bullet points
→ Use emoji headers for sections
→ Include ASCII diagrams (2-3 minimum)
→ Code in proper blocks
→ NO ** bold markers
→ Keep each point 1-2 lines max
→ Minimum 400 words, maximum 800 words

Generate DEEP, VISUAL, EXAM-READY notes!`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, imageData } = await req.json();

    if (!topic && !imageData) {
      return new Response(
        JSON.stringify({ error: "Topic or image is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generating advanced notes for:", topic || "image");

    let userContent: string | object[];
    
    if (imageData) {
      // Handle image-based notes
      userContent = [
        { type: "text", text: `Analyze this DSA problem/concept and create detailed notes: ${topic || ""}` },
        { type: "image_url", image_url: { url: imageData } }
      ];
    } else {
      userContent = `Create comprehensive, exam-ready notes with ASCII diagrams for: ${topic}

Include:
1. Multiple visual ASCII diagrams
2. Step-by-step dry run
3. Code with explanation
4. Complexity analysis
5. Interview tips
6. Practice problems`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: ADVANCED_NOTES_PROMPT },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Wait a moment!" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate notes" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const notes = data.choices?.[0]?.message?.content || "";

    console.log("Advanced notes generated successfully");

    return new Response(
      JSON.stringify({ notes }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
