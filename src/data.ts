import { Product } from './types';

export const CATEGORIES = [
  "All",
  "Lawn Collection",
  "Pret Wear",
  "Unstitched",
  "Accessories"
];

export const PAKISTANI_CITIES = [
  "Hyderabad",
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala"
];

export const PRODUCTS: Product[] = [
  {
    id: 'l1',
    name: 'Ebony Ivory Botanical Geometric',
    price: 3000,
    category: 'Lawn Collection',
    gender: 'Women',
    description: 'This sophisticated fabric features an elegant interplay of black and off-white, showcasing delicate botanical leaf motifs arranged in a classic lattice pattern. It is perfectly complemented by intricate geometric borders.',
    image: '/image/lawns/6.png',
    rating: 5.0,
    reviewsCount: 12,
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    inStock: true,
    isNewArrival: true,
    isFeatured: true
  },
  {
    id: 'l2',
    name: 'Vibrant Folk Floral Suit',
    price: 3000,
    category: 'Lawn Collection',
    gender: 'Women',
    description: 'This elegant three-piece ensemble showcases a deep black base beautifully adorned with intricate folk-inspired floral patterns. It comes alive with a vibrant spectrum of fuchsia, tangerine, and lime accents.',
    image: '/image/lawns/1.jpeg',
    rating: 4.8,
    reviewsCount: 8,
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    inStock: true,
    isFeatured: true
  },
  {
    id: 'l3',
    name: 'Painterly Tulip Garden',
    price: 3000,
    category: 'Lawn Collection',
    gender: 'Women',
    description: 'This vibrant fabric features a stunning, painterly depiction of orange, red, and yellow tulips and wildflowers against a backdrop of lush green foliage. Its artistic border design makes it perfect for elegant summer attire.',
    image: '/image/lawns/2.jpeg',
    rating: 4.9,
    reviewsCount: 15,
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    inStock: true,
    isNewArrival: true
  },
  {
    id: 'l4',
    name: 'Vibrant Ikat Palm Lawn',
    price: 3000,
    category: 'Unstitched',
    gender: 'Women',
    description: 'This captivating dress fabric showcases a dynamic fusion of vibrant, brushstroke-style stripes and intricate ethnic palm leaf and tree motifs on a crisp white base. Enhanced with detailed borders and scattered accent dots.',
    image: '/image/lawns/3.jpeg',
    rating: 4.7,
    reviewsCount: 6,
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    id: 'l5',
    name: 'Midnight Arabesque Lawn Suit',
    price: 3000,
    category: 'Lawn Collection',
    gender: 'Women',
    description: 'Intricate black and white arabesque motifs beautifully cover this premium lawn fabric, bringing timeless elegance. Complemented by subtle yellow accents and matching borders.',
    image: '/image/lawns/4.jpeg',
    rating: 4.8,
    reviewsCount: 11,
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    inStock: true,
    isFeatured: true
  },
  {
    id: 'l6',
    name: 'Monochrome Lattice Motif Pret',
    price: 3000,
    category: 'Pret Wear',
    gender: 'Women',
    description: 'Classic monochrome elegance with bold lattice and botanical motifs printed across comfortable premium fabric. An everyday essential that effortlessly elevates any look.',
    image: '/image/lawns/7.png',
    rating: 4.9,
    reviewsCount: 18,
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    isFeatured: true
  },
  {
    id: 'l7',
    name: 'Elegant Crimson & Gold Lawn',
    price: 3000,
    category: 'Lawn Collection',
    gender: 'Women',
    description: 'A beautiful blend of crimson and gold tones, featuring traditional block print style motifs. This unstitched ensemble is perfect for formal summer gatherings.',
    image: '/image/lawns/5.jpeg',
    rating: 4.8,
    reviewsCount: 14,
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    inStock: true,
    isNewArrival: true
  }
];
