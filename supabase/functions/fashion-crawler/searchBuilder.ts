// Builds search queries based on user preferences

import { CrawlRequest } from './types.ts';

export function buildSearchQuery(data: CrawlRequest): string {
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
