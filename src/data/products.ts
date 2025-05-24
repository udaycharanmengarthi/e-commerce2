import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Earbuds Pro',
    description: 'High-quality wireless earbuds with active noise cancellation and premium sound quality. Includes wireless charging case with up to 24 hours of battery life.',
    price: 149.99,
    discountPrice: 129.99,
    images: [
      'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'
    ],
    category: 'Audio',
    tags: ['wireless', 'earbuds', 'audio', 'bluetooth'],
    rating: 4.8,
    reviewCount: 256,
    stock: 42,
    featured: true
  },
  {
    id: '2',
    name: 'Premium Smart Watch',
    description: 'Advanced smartwatch with health monitoring, GPS, and a stunning always-on display. Water-resistant and compatible with all smartphones.',
    price: 299.99,
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg'
    ],
    category: 'Wearables',
    tags: ['watch', 'smartwatch', 'fitness', 'health'],
    rating: 4.7,
    reviewCount: 189,
    stock: 23,
    featured: true
  },
  {
    id: '3',
    name: 'Ultra-Slim Laptop',
    description: 'Powerful and lightweight laptop with a 14-inch 4K display, all-day battery life, and the latest generation processor.',
    price: 1299.99,
    discountPrice: 1199.99,
    images: [
      'https://images.pexels.com/photos/18105/pexels-photo.jpg',
      'https://images.pexels.com/photos/7974/pexels-photo.jpg'
    ],
    category: 'Computers',
    tags: ['laptop', 'ultrabook', 'portable', 'work'],
    rating: 4.9,
    reviewCount: 142,
    stock: 15,
    featured: true
  },
  {
    id: '4',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek, minimalist design fits any desk setup.',
    price: 49.99,
    images: [
      'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg',
      'https://images.pexels.com/photos/3690406/pexels-photo-3690406.jpeg'
    ],
    category: 'Accessories',
    tags: ['charging', 'wireless', 'accessories'],
    rating: 4.5,
    reviewCount: 98,
    stock: 67,
    featured: false
  },
  {
    id: '5',
    name: 'Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with industry-leading noise cancellation, amazing sound quality, and 30 hours of battery life.',
    price: 349.99,
    images: [
      'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg',
      'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg'
    ],
    category: 'Audio',
    tags: ['headphones', 'audio', 'noise-cancelling'],
    rating: 4.8,
    reviewCount: 217,
    stock: 31,
    featured: true
  },
  {
    id: '6',
    name: 'Smart Home Hub',
    description: 'Central smart home controller compatible with all major smart home devices and voice assistants.',
    price: 129.99,
    discountPrice: 99.99,
    images: [
      'https://images.pexels.com/photos/4316738/pexels-photo-4316738.jpeg',
      'https://images.pexels.com/photos/4219652/pexels-photo-4219652.jpeg'
    ],
    category: 'Smart Home',
    tags: ['smart home', 'automation', 'voice control'],
    rating: 4.6,
    reviewCount: 124,
    stock: 42,
    featured: false
  },
  {
    id: '7',
    name: 'Professional Camera Drone',
    description: 'High-performance drone with 4K camera, obstacle avoidance, and 30 minutes of flight time. Perfect for aerial photography and videography.',
    price: 799.99,
    images: [
      'https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg',
      'https://images.pexels.com/photos/4062453/pexels-photo-4062453.jpeg'
    ],
    category: 'Photography',
    tags: ['drone', 'camera', 'aerial', 'photography'],
    rating: 4.7,
    reviewCount: 87,
    stock: 8,
    featured: true
  },
  {
    id: '8',
    name: 'Premium Mechanical Keyboard',
    description: 'Mechanical keyboard with customizable RGB lighting, programmable keys, and premium build quality for the ultimate typing experience.',
    price: 149.99,
    images: [
      'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg',
      'https://images.pexels.com/photos/3687769/pexels-photo-3687769.jpeg'
    ],
    category: 'Accessories',
    tags: ['keyboard', 'mechanical', 'gaming', 'accessories'],
    rating: 4.6,
    reviewCount: 142,
    stock: 29,
    featured: false
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
};

export const getCategories = (): string[] => {
  return [...new Set(products.map(product => product.category))];
};

export const searchProducts = (query: string): Product[] => {
  const searchTerms = query.toLowerCase().split(' ');
  return products.filter(product => {
    const searchText = `${product.name} ${product.description} ${product.category} ${product.tags.join(' ')}`.toLowerCase();
    return searchTerms.every(term => searchText.includes(term));
  });
};

export const filterProducts = (options: {
  categories?: string[];
  priceRange?: [number, number];
  inStock?: boolean;
  sortBy?: string;
  searchQuery?: string;
}): Product[] => {
  let filtered = [...products];

  // Apply search query if provided
  if (options.searchQuery) {
    filtered = searchProducts(options.searchQuery);
  }

  // Apply category filter
  if (options.categories && options.categories.length > 0) {
    filtered = filtered.filter(product =>
      options.categories!.includes(product.category.toLowerCase())
    );
  }

  // Apply price range filter
  if (options.priceRange) {
    filtered = filtered.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= options.priceRange![0] && price <= options.priceRange![1];
    });
  }

  // Apply in-stock filter
  if (options.inStock) {
    filtered = filtered.filter(product => product.stock > 0);
  }

  // Apply sorting
  if (options.sortBy) {
    filtered.sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      switch (options.sortBy) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'rating':
          return b.rating - a.rating;
        default: // featured
          return b.featured === a.featured ? 0 : b.featured ? 1 : -1;
      }
    });
  }

  return filtered;
};