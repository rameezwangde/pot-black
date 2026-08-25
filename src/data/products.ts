export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  salePrice?: number;
  quantityInStock: number;
  stockStatus: 'In Stock' | 'Out of Stock';
  status: 'Active' | 'Inactive';
  image: string;
  images?: string[];
}

export const products: Product[] = [
  {
    id: 'p1',
    name: '3 in 1 Tip Shaper Tool',
    description: 'Multi-purpose cue tip tool designed for shaping, scuffing, and maintaining your cue tip for consistent performance.',
    category: 'Accessories',
    price: 35,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: '/images/products/3-in-1-tip-shaper/01.jpg',
    images: [
      '/images/products/3-in-1-tip-shaper/01.jpg',
      '/images/products/3-in-1-tip-shaper/02.jpg',
      '/images/products/3-in-1-tip-shaper/03.jpg',
      '/images/products/3-in-1-tip-shaper/04.jpg'
    ]
  },
  {
    id: 'p2',
    name: 'Billiards Ball Rack',
    description: 'Durable ball rack designed to neatly arrange billiards balls for accurate and consistent game setups.',
    category: 'Accessories',
    price: 20,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: '/images/products/billiards-ball-rack/01.jpg',
    images: [
      '/images/products/billiards-ball-rack/01.jpg',
      '/images/products/billiards-ball-rack/02.jpg',
      '/images/products/billiards-ball-rack/03.jpg',
      '/images/products/billiards-ball-rack/04.jpg'
    ]
  },
  {
    id: 'p3',
    name: 'Billiards Cue Bag - B&W',
    description: 'Stylish black and white cue bag designed to safely store and carry your billiards cue with ease.',
    category: 'Bags & Cases',
    price: 80,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: '/images/products/billiards-cue-bag-bw/01.jpg',
    images: [
      '/images/products/billiards-cue-bag-bw/01.jpg',
      '/images/products/billiards-cue-bag-bw/02.jpg'
    ]
  },
  {
    id: 'p4',
    name: 'Billiards Cue Bag - Black',
    description: 'Classic black cue bag offering convenient and secure storage for your billiards cue while on the go.',
    category: 'Bags & Cases',
    price: 80,
    salePrice: 50,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: '/images/products/billiards-cue-bag-black/01.jpg',
    images: [
      '/images/products/billiards-cue-bag-black/01.jpg',
      '/images/products/billiards-cue-bag-black/02.jpg'
    ]
  },
  {
    id: 'p5',
    name: 'Billiards Cue Bag - Pink',
    description: 'Stylish pink cue bag designed to protect and conveniently carry your billiards cue.',
    category: 'Bags & Cases',
    price: 80,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: '/images/products/billiards-cue-bag-pink/01.jpg',
    images: [
      '/images/products/billiards-cue-bag-pink/01.jpg',
      '/images/products/billiards-cue-bag-pink/02.jpg'
    ]
  },
  {
    id: 'p6',
    name: 'Billiards Cue Bag - White',
    description: 'Clean and stylish white cue bag designed to safely store and carry your billiards cue.',
    category: 'Bags & Cases',
    price: 80,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: '/images/products/billiards-cue-bag-white/01.jpg',
    images: [
      '/images/products/billiards-cue-bag-white/01.jpg',
      '/images/products/billiards-cue-bag-white/02.jpg'
    ]
  },
  {
    id: 'p7',
    name: 'Dragon Carbon Fiber Billiards Cue',
    description: 'High-performance carbon fiber billiards cue designed for durability, stability, and a smooth playing experience.',
    category: 'Billiards Cues',
    price: 350,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: '/images/products/dragon-carbon-fiber-cue/01.jpg',
    images: [
      '/images/products/dragon-carbon-fiber-cue/01.jpg',
      '/images/products/dragon-carbon-fiber-cue/02.jpg',
      '/images/products/dragon-carbon-fiber-cue/03.jpg',
      '/images/products/dragon-carbon-fiber-cue/04.jpg',
      '/images/products/dragon-carbon-fiber-cue/05.jpg',
      '/images/products/dragon-carbon-fiber-cue/06.jpg',
      '/images/products/dragon-carbon-fiber-cue/07.jpg'
    ]
  },
  {
    id: 'p8',
    name: 'Predator Victory Billiards Cue Tip - S, M & H',
    description: 'Premium Predator Victory cue tip available in Soft, Medium, and Hard options for different playing preferences and control.',
    category: 'Billiards Cue Tips',
    price: 50,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: '/images/products/predator-victory-tip/01.jpg',
    images: [
      '/images/products/predator-victory-tip/01.jpg',
      '/images/products/predator-victory-tip/02.jpg',
      '/images/products/predator-victory-tip/03.jpg'
    ]
  },
  {
    id: 'p9',
    name: 'Precal Billiards Cue',
    description: 'Quality billiards cue designed for comfortable handling, reliable performance, and consistent shots.',
    category: 'Billiards Cues',
    price: 250,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: '/images/products/precal-cue/01.jpg',
    images: [
      '/images/products/precal-cue/01.jpg',
      '/images/products/precal-cue/02.jpg',
      '/images/products/precal-cue/03.jpg',
      '/images/products/precal-cue/04.jpg',
      '/images/products/precal-cue/05.jpg',
      '/images/products/precal-cue/06.jpg',
      '/images/products/precal-cue/07.jpg',
      '/images/products/precal-cue/08.jpg',
      '/images/products/precal-cue/09.jpg',
      '/images/products/precal-cue/10.jpg',
      '/images/products/precal-cue/11.jpg',
      '/images/products/precal-cue/12.jpg',
      '/images/products/precal-cue/13.jpg'
    ]
  },
  {
    id: 'p10',
    name: 'Supreme Billiards Cue',
    description: 'Well-balanced billiards cue designed for smooth handling and consistent performance during play.',
    category: 'Billiards Cues',
    price: 200,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: '/images/products/supreme-billiards-cue/01.jpg',
    images: [
      '/images/products/supreme-billiards-cue/01.jpg',
      '/images/products/supreme-billiards-cue/02.jpg',
      '/images/products/supreme-billiards-cue/03.jpg',
      '/images/products/supreme-billiards-cue/04.jpg',
      '/images/products/supreme-billiards-cue/05.jpg'
    ]
  },
  {
    id: 'p11',
    name: 'VanQ5 Billiards Cue - Red',
    description: 'Stylish red VanQ5 billiards cue designed for comfortable handling and accurate, consistent play.',
    category: 'Billiards Cues',
    price: 200,
    salePrice: 180,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: 'https://placehold.co/600x600/1A0E0E/D4AF37?text=VanQ5+Red'
  },
  {
    id: 'p12',
    name: 'VanQ5 Billiards Cue - White',
    description: 'Sleek white VanQ5 billiards cue offering comfortable handling and dependable performance.',
    category: 'Billiards Cues',
    price: 200,
    salePrice: 180,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: 'https://placehold.co/600x600/1A0E0E/D4AF37?text=VanQ5+White'
  },
  {
    id: 'p13',
    name: 'VanQ5 Billiards House Cue',
    description: 'Durable and reliable house cue from VanQ5, suitable for everyday billiards play and club use.',
    category: 'Billiards Cues',
    price: 200,
    salePrice: 180,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: 'https://placehold.co/600x600/1A0E0E/D4AF37?text=VanQ5+House+Cue'
  },
  {
    id: 'p14',
    name: 'VanQ5 Carbon Fiber Cue',
    description: 'Carbon fiber billiards cue designed for enhanced durability, stability, and consistent performance.',
    category: 'Billiards Cues',
    price: 300,
    quantityInStock: 10,
    stockStatus: 'In Stock',
    status: 'Active',
    image: 'https://placehold.co/600x600/1A0E0E/D4AF37?text=VanQ5+Carbon+Fiber'
  }
];
