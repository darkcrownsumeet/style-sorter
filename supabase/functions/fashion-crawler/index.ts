import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildSearchQuery } from './searchBuilder.ts';
import { getRecommendations } from './recommendations.ts';
import { generateStyleAnalysis } from './styleAnalysis.ts';
import { CrawlRequest } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fashion crawler request received');
    const requestData: CrawlRequest = await req.json();
    
    const searchQuery = buildSearchQuery(requestData);
    console.log('Search query:', searchQuery);
    
    const recommendations = await getRecommendations(searchQuery, requestData);
    const analysis = generateStyleAnalysis(requestData);
    
    const result = {
      recommendations,
      analysis,
      query: searchQuery
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fashion-crawler function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch fashion recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
