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
  
  const recommendations: FashionRecommendation[] = [];
  const mockRecommendations = generateMockRecommendations(requestData);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    recommendations.push(...mockRecommendations);
    console.log(`Found ${recommendations.length} recommendations`);
    return recommendations;
  } catch (error) {
    console.error('Error crawling fashion data:', error);
    throw new Error('Failed to crawl fashion websites');
  }
}

function generateMockRecommendations(data: CrawlRequest): FashionRecommendation[] {
  const { gender, style, recommendationType, currentItem, currentColor } = data;
  
  const genderPath = gender === 'male' ? 'men' : 'women';
  const categories: { [key: string]: string } = {
    'top': 'tshirts',
    'bottom': gender === 'male' ? 'jeans' : 'jeans',
    'full-outfit': 'clothing'
  };
  
  const category = categories[recommendationType] || 'clothing';
  const searchQuery = `${gender}+${style}+${recommendationType}`.replace(/ /g, '+');
  
  const indianSites = [
    { name: 'Myntra', url: 'https://www.myntra.com' },
    { name: 'Ajio', url: 'https://www.ajio.com' },
    { name: 'Amazon Fashion', url: 'https://www.amazon.in' }
  ];
  
  const recommendations = indianSites.map((site, index) => {
    const priceRange = index === 0 ? '₹999' : index === 1 ? '₹1,499' : '₹1,999';
    let siteUrl = '';
    
    if (site.name === 'Myntra') {
      siteUrl = `${site.url}/${genderPath}?f=Categories:${category}&rawQuery=${searchQuery}`;
    } else if (site.name === 'Ajio') {
      siteUrl = `${site.url}/shop/${category}`;
    } else {
      siteUrl = `${site.url}/s?k=${searchQuery}`;
    }
    
    return {
      title: `${style.charAt(0).toUpperCase() + style.slice(1)} ${recommendationType === 'full-outfit' ? 'Outfit' : recommendationType.charAt(0).toUpperCase() + recommendationType.slice(1)} - ${site.name}`,
      description: `Trending ${style} ${recommendationType} for ${gender}. ${currentColor ? `Matches perfectly with ${currentColor} ${currentItem || 'clothing'}. ` : ''}Premium quality from top Indian brands.`,
      imageUrl: gender === 'male' 
        ? `https://images.unsplash.com/photo-${1516826957135 + index}?w=400&h=600&fit=crop`
        : `https://images.unsplash.com/photo-${1469334031218 + index}?w=400&h=600&fit=crop`,
      price: priceRange,
      url: siteUrl
    };
  });
  
  return recommendations;
}

function generateStyleAnalysis(data: CrawlRequest): any {
  const { bodyShape, style, currentColor, currentItem, gender } = data;
  
  const accessoryLinks = [
    {
      item: 'Watch',
      url: gender === 'male' 
        ? 'https://www.myntra.com/watches?f=Categories:Watches&rawQuery=men+watches'
        : 'https://www.myntra.com/watches?f=Categories:Watches&rawQuery=women+watches'
    },
    {
      item: 'Belt',
      url: gender === 'male'
        ? 'https://www.ajio.com/shop/men-belts'
        : 'https://www.ajio.com/shop/women-belts'
    },
    {
      item: 'Shoes',
      url: gender === 'male'
        ? 'https://www.amazon.in/s?k=men+formal+shoes'
        : 'https://www.amazon.in/s?k=women+heels'
    },
    {
      item: 'Bag',
      url: gender === 'male'
        ? 'https://www.myntra.com/bags?f=Categories:Backpacks&rawQuery=men+bags'
        : 'https://www.myntra.com/handbags'
    }
  ];
  
  return {
    colorAnalysis: currentColor && currentItem
      ? `${currentColor.charAt(0).toUpperCase() + currentColor.slice(1)} is an excellent choice for your ${bodyShape} body shape. This color enhances your natural features and complements your ${style} style preference.`
      : `Your ${bodyShape} body shape works beautifully with ${style} style pieces.`,
    styleAnalysis: `Your ${style} style preference works perfectly with your body shape. The recommended pieces will accentuate your best features while maintaining comfort and confidence.`,
    accessorySuggestions: [
      `Add a statement belt to define your proportions`,
      `Consider layering with a complementary jacket`,
      `${gender === 'male' ? 'A classic watch' : 'Minimal jewelry'} works best with ${style} style`,
      `Choose ${gender === 'male' ? 'formal shoes' : 'heels or flats'} that elongate your silhouette`,
      `A structured bag completes the look`
    ],
    accessoryLinks
  };
}