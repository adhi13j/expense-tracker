// supabase/functions/ai-budget-tips/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// This is a placeholder for a real AI API call.
// In a real project, you would use fetch() to call the Gemini API or another service.
const getAiSuggestions = (pieChartData) => {
  const totalSpending = pieChartData.reduce((sum, item) => sum + item.value, 0);
  const suggestions = [
    `You spent a total of $${totalSpending.toFixed(2)}. Great job tracking!`,
    "Consider setting a specific budget for 'entertainment' next month.",
    "Your 'groceries' spending seems consistent. Look for loyalty programs to save more.",
    "Automating your 'bills' can help avoid late fees.",
  ];
  // This just picks a random suggestion for demonstration
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};

serve(async (req) => {
  // This is needed to handle CORS requests from the browser
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Get the user's spending data from the request
    const { pieChartData } = await req.json();

    // 2. Get a suggestion from our "AI"
    const suggestion = getAiSuggestions(pieChartData);

    // 3. Return the suggestion
    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
