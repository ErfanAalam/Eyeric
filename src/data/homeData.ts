import { Eye, Glasses, Sun, Shield, Clock, Users, Heart } from "lucide-react";
import { CategoryData, Brand, BestSeller, Shape, ProductType, Feature, ProductCategory, Slide } from "../types/data";

// Hero Slider Data
export const heroSlides: Slide[] = [
  {
    image: "https://yourspex.com/cdn/shop/files/Buy_1_Get_1_Free_1.jpg?v=1744283854",
  },
  {
    image: "https://yourspex.com/cdn/shop/files/Exclusive_Styles-01_1.jpg?v=1749555842&width=750",
  },
  {
    image: "https://yourspex.com/cdn/shop/files/Free_Home_eye_test-01_b0e90012-3b11-4a29-80c4-96462bc93cd7.jpg?v=1749553388&width=750",
  },
];
// export async function getHeroSlides() {
//   const { data, error } = await supabase
//     .from('slide')
//     .select('*')
//     .order('created_at', { ascending: false });
//   if (error) throw error;
//   // Return in the format expected by the homepage slider
//   return (data || []).map(slide => ({ image: slide.image_url }));
// }

// Category Data
export const categoryData: CategoryData = {
  men: [
    {
      title: "Eyeglasses",
      image: "https://images.unsplash.com/photo-1739237965255-a744c8dde2ae?q=80&w=400&auto=format&fit=crop",
      description: "Professional eyewear for modern gentleman",
    },
    {
      title: "Sunglasses",
      image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&h=250&fit=crop",
      description: "Luxury sunglasses with UV protection",
    },
    {
      title: "Computer Glasses",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop",
      description: "Blue light blocking technology",
    },
  ],
  women: [
    {
      title: "Eyeglasses",
      image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=250&fit=crop",
      description: "Sophisticated eyewear for every occasion",
    },
    {
      title: "Sunglasses",
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=250&fit=crop",
      description: "Trendy sunglasses for style-conscious women",
    },
    {
      title: "Computer Glasses",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop",
      description: "Classic cat-eye designs reimagined",
    },
  ],
  kids: [
    {
      title: "Eyeglasses",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop",
      description: "Bright and playful designs for children",
    },
    {
      title: "Sunglasses",
      image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop",
      description: "Built to withstand active play",
    },
  ],
};

// Brand Data
export const brands: Brand[] = [
  { name: "Ray-Ban", logo: "RB", color: "from-red-500 to-orange-500" },
  { name: "Oakley", logo: "OK", color: "from-blue-500 to-green-500" },
  { name: "Prada", logo: "PR", color: "from-purple-500 to-pink-500" },
  { name: "Gucci", logo: "GU", color: "from-green-500 to-teal-500" },
  { name: "Tom Ford", logo: "TF", color: "from-gray-700 to-gray-900" },
  { name: "Versace", logo: "VE", color: "from-yellow-500 to-orange-500" },
];

// Best Sellers Data
export const bestSellers: BestSeller[] = [
  {
    name: "Classic Aviator Sunglasses",
    price: "$129.99",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
    badge: "Best Seller",
    displayOrder: 1
  },
  {
    name: "Women's Cat Eye Sunglasses",
    price: "$89.99",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=300&fit=crop",
    badge: "Top Rated",
    displayOrder: 2
  },
  {
    name: "Round Metal Frame Glasses",
    price: "$149.99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
    badge: "Trending",
    displayOrder: 3
  },
  {
    name: "Men's Wayfarer Sunglasses",
    price: "$119.99",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=300&fit=crop",
    badge: "Popular",
    displayOrder: 4
  },
];

// Shapes Data
export const shapes: Shape[] = [
  {
    name: "Round",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=400&fit=crop",
    description: "Classic round frames for a timeless look",
  },
  {
    name: "Cat-Eye",
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=400&fit=crop",
    description: "Elegant cat-eye frames for sophistication",
  },
  {
    name: "Aviator",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop",
    description: "Classic aviator style for adventure",
  },
  {
    name: "Wayfarer",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=400&fit=crop",
    description: "Iconic wayfarer design for versatility",
  },
  {
    name: "Oval",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=400&fit=crop",
    description: "Iconic oval design for versatility",
  },
  {
    name: "Rectangle",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=400&fit=crop",
    description: "Iconic rectangle design for versatility",
  },
  {
    name: "Square",
    image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&h=400&fit=crop",
    description: "Bold square frames for a modern edge",
  },
];

// Product Info Data
export const productTypes: ProductType[] = [
  {
    icon: Glasses,
    title: "Eyeglasses",
    description: "Precision-crafted prescription lenses with designer frames for optimal vision correction and style.",
    features: ["Anti-glare coating", "UV protection", "Scratch-resistant", "Custom prescriptions"],
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: Sun,
    title: "Sunglasses",
    description: "Premium UV protection sunglasses that combine fashion with function for all-day comfort.",
    features: ["100% UV protection", "Polarized lenses", "Impact-resistant", "Stylish designs"],
    color: "from-orange-500 to-red-600"
  },
  {
    icon: Eye,
    title: "Computer Glasses",
    description: "Innovative eyewear solutions including blue light blocking glasses and sports frames.",
    features: ["Blue light filtering", "Lightweight materials", "Flexible hinges", "Sport-specific designs"],
    color: "from-green-500 to-emerald-600"
  }
];

export const features: Feature[] = [
  { icon: Shield, title: "Lifetime Warranty", desc: "Premium protection for your investment" },
  { icon: Clock, title: "Fast Delivery", desc: "Quick shipping to your doorstep" },
  { icon: Users, title: "Expert Support", desc: "Professional guidance and advice" },
  { icon: Heart, title: "Customer Love", desc: "99% satisfaction guarantee" }
];

// Product Categories Data
export const productCategories: ProductCategory[] = [
  {
    title: "Sunglasses",
    icon: Sun,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=400&fit=crop",
    description: "Premium UV protection with style",
    gradient: "from-orange-400 to-red-500",
  },
  {
    title: "Eyeglasses",
    icon: Glasses,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=400&fit=crop",
    description: "Prescription lenses for perfect vision",
    gradient: "from-blue-400 to-purple-500",
  },
  {
    title: "Computer Glasses",
    icon: Eye,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=400&fit=crop",
    description: "Blue light blocking technology",
    gradient: "from-green-400 to-blue-500",
  },
];

// Admin Editable Banner Data
export const makeInIndia = {
  styledBy: "Eyeric Eyewear",
  title: "Premium Eyewear Collection",
  subtitle: "Proudly Made in India 🇮🇳",
  buttonText: "SHOP NOW",
  buttonUrl: "/shop-eyewear",
}; 