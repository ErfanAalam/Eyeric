import { LucideIcon } from 'lucide-react';

// Hero Slider Types
export interface Slide {
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
}

// Category Types
export interface CategoryItem {
  title: string;
  image: string;
  description: string;
}

export interface CategoryData {
  [key: string]: CategoryItem[];
}

// Brand Types
export interface Brand {
  name: string;
  logo: string;
  color: string;
}

// Best Seller Types
export interface BestSeller {
  name: string;
  price: string;
  rating: number;
  image: string;
  badge: string;
  displayOrder: number;
}

// Shape Types
export interface Shape {
  name: string;
  image: string;
  description: string;
}

// Product Info Types
export interface ProductType {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  color: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

// Product Category Types
export interface ProductCategory {
  title: string;
  icon: LucideIcon;
  image: string;
  description: string;
  gradient: string;
} 