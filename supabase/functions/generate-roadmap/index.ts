import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ROADMAP_SYSTEM_PROMPT = `You are DSA Dost AI, an expert DSA mentor. Generate a personalized DSA learning roadmap based on the user's input.

IMPORTANT: You must respond with ONLY valid JSON, no markdown, no code blocks, no extra text.

The JSON structure must be exactly:
{
  "title": "Personalized title based on goal",
  "totalWeeks": number,
  "dailyTime": "time string",
  "weeks": [
    {
      "week": 1,
      "title": "Week title",
      "topics": ["topic1", "topic2", "topic3"],
      "practiceProblems": number,
      "milestone": "optional milestone text or null"
    }
  ],
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}

Guidelines:
- For beginners: Start with basics, go slower, more fundamentals
- For intermediate: Skip basics, focus on core DSA
- For advanced: Focus on hard problems, optimization, patterns
- For placements: Cover all standard topics
- For FAANG: Focus on hard problems, system design prep
- For competitive: Focus on advanced algorithms, math
- Milestones should be at key achievement points (every 3-4 weeks)
- Tips should be practical and motivating in Hinglish style
- Topics should be specific and learnable (e.g., "Two Sum Pattern" not just "Arrays")
- Practice problems count should match the difficulty and time available`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { level, goal, dailyTime, targetWeeks } = await req.json();

    // Validate inputs
    if (!level || !goal || !dailyTime || !targetWeeks) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service is not configured. Please try again later." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate level
    const validLevels = ["beginner", "intermediate", "advanced"];
    if (!validLevels.includes(level)) {
      return new Response(
        JSON.stringify({ error: "Invalid level" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate goal
    const validGoals = ["placements", "competitive", "general", "faang"];
    if (!validGoals.includes(goal)) {
      return new Response(
        JSON.stringify({ error: "Invalid goal" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate dailyTime
    const validTimes = ["30min", "1hr", "2hr", "3hr+"];
    if (!validTimes.includes(dailyTime)) {
      return new Response(
        JSON.stringify({ error: "Invalid daily time" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate targetWeeks
    if (typeof targetWeeks !== "number" || targetWeeks < 4 || targetWeeks > 52) {
      return new Response(
        JSON.stringify({ error: "Target weeks must be between 4 and 52" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userPrompt = `Create a ${targetWeeks}-week DSA roadmap for:
- Current Level: ${level}
- Goal: ${goal}
- Daily Time: ${dailyTime}

Make the roadmap realistic and achievable. Include milestones to keep the student motivated.`;

    console.log("Generating roadmap via Lovable AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: ROADMAP_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to generate roadmap. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let roadmap;
    try {
      // Try to extract JSON from the response (handle potential markdown code blocks)
      let jsonStr = responseText;
      if (responseText.includes("```json")) {
        jsonStr = responseText.split("```json")[1].split("```")[0].trim();
      } else if (responseText.includes("```")) {
        jsonStr = responseText.split("```")[1].split("```")[0].trim();
      }
      roadmap = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse roadmap JSON:", parseError, responseText);
      return new Response(
        JSON.stringify({ error: "Failed to parse roadmap. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate roadmap structure
    if (!roadmap.title || !roadmap.weeks || !Array.isArray(roadmap.weeks)) {
      console.error("Invalid roadmap structure:", roadmap);
      return new Response(
        JSON.stringify({ error: "Invalid roadmap format. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Successfully generated roadmap");

    return new Response(
      JSON.stringify({ roadmap }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-roadmap:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
