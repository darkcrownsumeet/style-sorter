// Generates style analysis and accessory suggestions

import { CrawlRequest, StyleAnalysis, AccessoryLink } from './types.ts';

export function generateStyleAnalysis(data: CrawlRequest): StyleAnalysis {
  const { bodyShape, style, currentColor, currentItem, gender } = data;
  
  const accessoryLinks = getAccessoryLinks(gender);
  
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

function getAccessoryLinks(gender: string): AccessoryLink[] {
  return [
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
}
