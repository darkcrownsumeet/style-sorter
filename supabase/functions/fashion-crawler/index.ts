import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CrawlRequest {
  gender: string;
  bodyShape: string;
  height: string;
  style: string;
  recommendationType: string;
  currentItem?: string;
  currentColor?: string;
}

interface FashionRecommendation {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  url: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fashion crawler request received');
    const requestData: CrawlRequest = await req.json();
    
    // Construct search query based on user preferences
    const searchQuery = constructSearchQuery(requestData);
    console.log('Search query:', searchQuery);
    
    // Crawl fashion websites for recommendations
    const recommendations = await crawlFashionData(searchQuery, requestData);
    
    // Generate style analysis
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

function constructSearchQuery(data: CrawlRequest): string {
  const { gender, style, recommendationType, currentItem, currentColor } = data;
  
  let query = `${gender} ${style} ${recommendationType}`;
  
  if (currentItem && currentColor) {
    if (recommendationType === 'top') {
      query += ` that matches ${currentColor} ${currentItem}`;
    } else if (recommendationType === 'bottom') {
      query += ` that matches ${currentColor} ${currentItem}`;
    }
  }
  
  return query;
}

async function crawlFashionData(query: string, requestData: CrawlRequest): Promise<FashionRecommendation[]> {
  console.log('Starting fashion data crawl for:', query);
  
  // List of fashion websites to crawl
  const fashionSites = [
    'https://www.zara.com',
    'https://www.hm.com', 
    'https://www.uniqlo.com',
    'https://www.asos.com'
  ];
  
  const recommendations: FashionRecommendation[] = [];
  
  // For demo purposes, we'll simulate crawling with mock data
  // In a real implementation, you'd use a web scraping service or API
  const mockRecommendations = generateMockRecommendations(requestData);
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add the mock recommendations
    recommendations.push(...mockRecommendations);
    
    console.log(`Found ${recommendations.length} recommendations`);
    return recommendations;
    
  } catch (error) {
    console.error('Error crawling fashion data:', error);
    throw new Error('Failed to crawl fashion websites');
  }
}

function generateMockRecommendations(data: CrawlRequest): FashionRecommendation[] {
  const { gender, style, recommendationType } = data;
  
  const baseRecommendations = [
    {
      title: `${gender} ${style} ${recommendationType}`,
      description: `Perfect ${style} ${recommendationType} for ${gender}. High quality materials and modern design.`,
      imageUrl: `https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=600&fit=crop`,
      price: '$49.99',
      url: 'https://example-fashion-store.com/item1'
    },
    {
      title: `Premium ${style} ${recommendationType}`,
      description: `Elegant ${style} ${recommendationType} with exceptional comfort and style.`,
      imageUrl: `https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop`,
      price: '$79.99', 
      url: 'https://example-fashion-store.com/item2'
    },
    {
      title: `Designer ${style} ${recommendationType}`,
      description: `Luxurious ${style} ${recommendationType} from top designers. Perfect fit guaranteed.`,
      imageUrl: `https://images.unsplash.com/photo-1506629905607-94b3d6c5c2c8?w=400&h=600&fit=crop`,
      price: '$129.99',
      url: 'https://example-fashion-store.com/item3'
    }
  ];
  
  // Customize based on gender
  if (gender === 'female') {
    baseRecommendations[0].imageUrl = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop';
    baseRecommendations[1].imageUrl = 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop';
    baseRecommendations[2].imageUrl = 'https://images.unsplash.com/photo-1506629905607-94b3d6c5c2c8?w=400&h=600&fit=crop';
  }
  
  return baseRecommendations;
}

function generateStyleAnalysis(data: CrawlRequest): any {
  const { bodyShape, style, currentColor, currentItem } = data;
  
  return {
    colorAnalysis: `${currentColor} is an excellent choice for your ${bodyShape} body shape. This color enhances your natural features and complements your ${style} style preference.`,
    styleAnalysis: `Your ${style} style preference works perfectly with your body shape. The recommended pieces will accentuate your best features while maintaining comfort and confidence.`,
    accessorySuggestions: [
      `Add a statement belt to define your waist`,
      `Consider layering with a complementary jacket`,
      `Minimal jewelry works best with ${style} style`,
      `Choose shoes that elongate your silhouette`,
      `A structured bag completes the look`
    ]
  };
}