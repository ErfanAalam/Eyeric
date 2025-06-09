const productData = [
  {
    id: "SG001",
    title: "Classic Aviator Sunglasses",
    description: "Timeless aviator sunglasses with UV protection and polarized lenses",
    price: 129.99,
    displayOrder: 1,
    gender: "unisex",
    type: "sunglasses",
    shape: "aviator",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "SG002",
    title: "Women's Cat Eye Sunglasses",
    description: "Elegant cat eye sunglasses with gradient lenses",
    price: 89.99,
    displayOrder: 2,
    gender: "women",
    type: "sunglasses",
    shape: "cat-eye",
    image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=250&fit=crop"
  },
  {
    id: "EG001",
    title: "Round Metal Frame Glasses",
    description: "Classic round metal frame prescription glasses",
    price: 149.99,
    displayOrder: 3,
    gender: "unisex",
    type: "eyeglasses",
    shape: "round",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "SG003",
    title: "Men's Wayfarer Sunglasses",
    description: "Classic wayfarer style with polarized lenses",
    price: 119.99,
    displayOrder: 4,
    gender: "men",
    type: "sunglasses",
    shape: "wayfarer",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop"
  },
  {
    id: "CG001",
    title: "Blue Light Blocking Computer Glasses",
    description: "Anti-glare computer glasses with blue light protection",
    price: 79.99,
    displayOrder: 5,
    gender: "unisex",
    type: "computer glasses",
    shape: "round",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "SG004",
    title: "Kids Sports Sunglasses",
    description: "Durable sports sunglasses for active children",
    price: 49.99,
    displayOrder: 6,
    gender: "kids",
    type: "sunglasses",
    shape: "sports",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop"
  },
  {
    id: "EG002",
    title: "Women's Cat Eye Prescription Glasses",
    description: "Stylish cat eye frame for prescription lenses",
    price: 159.99,
    displayOrder: 7,
    gender: "women",
    type: "eyeglasses",
    shape: "cat-eye",
    image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=250&fit=crop"
  },
  {
    id: "SG005",
    title: "Sports Performance Sunglasses",
    description: "High-performance sports sunglasses with wrap-around design",
    price: 169.99,
    displayOrder: 8,
    gender: "men",
    type: "sunglasses",
    shape: "sports",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop"
  },
  {
    id: "CG002",
    title: "Premium Computer Glasses",
    description: "Premium blue light blocking glasses with anti-fatigue coating",
    price: 99.99,
    displayOrder: 9,
    gender: "unisex",
    type: "computer glasses",
    shape: "wayfarer",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "EG003",
    title: "Kids Round Frame Glasses",
    description: "Durable and comfortable round frame for children",
    price: 69.99,
    displayOrder: 10,
    gender: "kids",
    type: "eyeglasses",
    shape: "round",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop"
  },
  {
    id: "SG006",
    title: "Designer Round Sunglasses",
    description: "Luxury round frame sunglasses with gold-tone accents",
    price: 199.99,
    displayOrder: 11,
    gender: "women",
    type: "sunglasses",
    shape: "round",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "EG004",
    title: "Men's Aviator Prescription Glasses",
    description: "Classic aviator style prescription glasses with anti-reflective coating",
    price: 179.99,
    displayOrder: 12,
    gender: "men",
    type: "eyeglasses",
    shape: "aviator",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "CG003",
    title: "Gaming Computer Glasses",
    description: "Specialized gaming glasses with enhanced blue light protection",
    price: 129.99,
    displayOrder: 13,
    gender: "unisex",
    type: "computer glasses",
    shape: "sports",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "SG007",
    title: "Kids Aviator Sunglasses",
    description: "Durable and lightweight aviator sunglasses for children",
    price: 39.99,
    displayOrder: 14,
    gender: "kids",
    type: "sunglasses",
    shape: "aviator",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop"
  },
  {
    id: "EG005",
    title: "Vintage Wayfarer Glasses",
    description: "Retro-inspired wayfarer prescription glasses",
    price: 169.99,
    displayOrder: 15,
    gender: "unisex",
    type: "eyeglasses",
    shape: "wayfarer",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "SG008",
    title: "Women's Sports Sunglasses",
    description: "Lightweight sports sunglasses with polarized lenses",
    price: 149.99,
    displayOrder: 16,
    gender: "women",
    type: "sunglasses",
    shape: "sports",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop"
  },
  {
    id: "CG004",
    title: "Executive Computer Glasses",
    description: "Professional computer glasses with premium blue light filtering",
    price: 159.99,
    displayOrder: 17,
    gender: "men",
    type: "computer glasses",
    shape: "wayfarer",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "EG006",
    title: "Kids Cat Eye Glasses",
    description: "Fun and colorful cat eye frames for children",
    price: 79.99,
    displayOrder: 18,
    gender: "kids",
    type: "eyeglasses",
    shape: "cat-eye",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop"
  },
  {
    id: "SG009",
    title: "Premium Aviator Sunglasses",
    description: "High-end aviator sunglasses with crystal lenses",
    price: 299.99,
    displayOrder: 19,
    gender: "unisex",
    type: "sunglasses",
    shape: "aviator",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "EG007",
    title: "Designer Round Glasses",
    description: "Luxury round frame prescription glasses with titanium frame",
    price: 249.99,
    displayOrder: 20,
    gender: "women",
    type: "eyeglasses",
    shape: "round",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "EG008",
    title: "Modern Square Frame Glasses",
    description: "Contemporary square frame prescription glasses with minimalist design",
    price: 189.99,
    displayOrder: 21,
    gender: "unisex",
    type: "eyeglasses",
    shape: "square",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "SG010",
    title: "Designer Square Sunglasses",
    description: "Luxury square frame sunglasses with polarized lenses",
    price: 249.99,
    displayOrder: 22,
    gender: "women",
    type: "sunglasses",
    shape: "square",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop"
  },
  {
    id: "CG005",
    title: "Square Computer Glasses",
    description: "Modern square frame computer glasses with blue light protection",
    price: 119.99,
    displayOrder: 23,
    gender: "unisex",
    type: "computer glasses",
    shape: "square",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  },
  {
    id: "EG009",
    title: "Kids Square Frame Glasses",
    description: "Durable square frame glasses for children with impact-resistant lenses",
    price: 89.99,
    displayOrder: 24,
    gender: "kids",
    type: "eyeglasses",
    shape: "square",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=250&fit=crop"
  },
  {
    id: "SG011",
    title: "Men's Square Sports Sunglasses",
    description: "Athletic square frame sunglasses with wrap-around design",
    price: 179.99,
    displayOrder: 25,
    gender: "men",
    type: "sunglasses",
    shape: "square",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=250&fit=crop"
  }
];

export default productData; 