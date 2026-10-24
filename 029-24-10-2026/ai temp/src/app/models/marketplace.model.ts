export interface Artisan {
  id: string;
  name: string;
  studioName: string;
  location: string;
  country: string;
  avatar: string;
  workshopImage: string;
  bio: string;
  story: string;
  craftSpecialty: string;
  yearsCrafting: number;
  badges: string[];
  verified: boolean;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  date: string;
  rating: number;
  comment: string;
  customerPhoto?: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  artisanId: string;
  artisan: Artisan;
  price: number;
  category: 'Ceramics' | 'Textiles' | 'Woodwork' | 'Leather' | 'Candles' | 'Jewelry';
  materialTag: string; // Forest green tertiary badge (e.g., "Hand-thrown Stoneware")
  processSummary: string;
  narrativeStory: string;
  provenance: {
    origin: string;
    workshop: string;
    leadTime: string;
    shippingNotes: string;
  };
  materialsList: string[];
  images: string[];
  variants?: {
    name: string;
    options: string[];
  };
  dimensions?: string;
  careInstructions?: string;
  batchInfo: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
  noteToMaker?: string;
}

export interface StoryArticle {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  contentParagraphs: string[];
  quote: string;
  quoteAuthor: string;
  category: string;
  featuredProductId?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
