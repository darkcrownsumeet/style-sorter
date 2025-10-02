// Data types used across the fashion crawler

export interface CrawlRequest {
  gender: string;
  bodyShape: string;
  height: string;
  style: string;
  recommendationType: string;
  currentItem?: string;
  currentColor?: string;
}

export interface FashionRecommendation {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  url: string;
}

export interface AccessoryLink {
  item: string;
  url: string;
}

export interface StyleAnalysis {
  colorAnalysis: string;
  styleAnalysis: string;
  accessorySuggestions: string[];
  accessoryLinks: AccessoryLink[];
}
