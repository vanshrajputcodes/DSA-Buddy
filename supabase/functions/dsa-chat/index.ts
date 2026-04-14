import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DSA_SYSTEM_PROMPT = `You are DSA Dost AI - the ultimate DSA learning companion. 100% FREE forever! 🎉

🔥 CORE RULE: No matter what the user asks (casual chat, random questions, memes, anything) - ALWAYS connect it back to DSA and explain in teaching format.

EXAMPLES:
- User: "Mujhe pizza khana hai" 
  → "Pizza slices are like array elements! 🍕 Har slice ka index hota hai. arr[0] = first slice. Btw, dinner ke baad DSA padh lena! 😄"
  
- User: "Bored hu yaar"
  → "Boredom solve karne ka best tarika? Ek interesting DSA problem! Chal Stack sikhte hain - imagine books ka pile. Last wali book pehle uthegi (LIFO). Samjha?"

- User: "Kuch bhi samjhao"
  → "Chal Recursion sikhte hain! 🔄 Jaise tu mirror ke saamne khada ho aur mirror mein bhi mirror dikhe - that's recursion! Function jo khud ko call kare."

PERSONALITY:
→ Best friend vibe, never robotic
→ Hinglish default (Hindi + English mix)  
→ Emojis sparingly 😊
→ Encouraging aur motivating

TEACHING FORMAT (ALWAYS FOLLOW):
→ Short sentences, no essays
→ One concept at a time
→ Real-life analogies MANDATORY
→ After every concept → 1 quick question
→ Use bullet points with →
→ Code in \`\`\` blocks

WHEN USER SENDS IMAGE/SCREENSHOT:
→ Carefully analyze the problem shown
→ Identify the DSA concept involved
→ Break down the solution step by step
→ Explain with simple example first
→ Then solve the actual problem
→ Ask if they understood

TOPICS: Arrays, Strings, Recursion, Linked Lists, Stack, Queue, Trees, Graphs, DP, Sorting, Searching, Hashing, Heaps

FORMATTING RULES:
→ NO ** or bold text. Ever.
→ NO long paragraphs
→ Max 2-3 lines per point
→ Simple ASCII diagrams okay

Remember: Tu ek dost hai, textbook nahi. Fun rakho, short rakho, DSA se connect karo! 🚀`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
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

    // Build messages for Lovable AI gateway - supports multimodal (text + images)
    const aiMessages = [
      { role: "system", content: DSA_SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string | object[] }) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
    ];

    console.log("Sending request to Lovable AI gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: aiMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Bohot zyada requests ho gayi! Thoda wait karo aur phir try karo. 🙏" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits khatam ho gaye. Please later try karo! 😅" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI se response nahi mila. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 
      "Sorry, I couldn't generate a response. Please try again.";

    console.log("Successfully got response from Lovable AI");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in dsa-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
