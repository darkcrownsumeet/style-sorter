// Generates fashion recommendations from Indian shopping sites

import { CrawlRequest, FashionRecommendation } from './types.ts';

export async function getRecommendations(
  query: string,
  requestData: CrawlRequest
): Promise<FashionRecommendation[]> {
  console.log('Fetching recommendations for:', query);
  
  const recommendations: FashionRecommendation[] = [];
  const mockRecommendations = generateIndianSiteLinks(requestData);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    recommendations.push(...mockRecommendations);
    console.log(`Found ${recommendations.length} recommendations`);
    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw new Error('Failed to fetch fashion recommendations');
  }
}

function generateIndianSiteLinks(data: CrawlRequest): FashionRecommendation[] {
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
