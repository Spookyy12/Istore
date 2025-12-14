import { DeliveryOption, Product } from '../types';

// Mock Initial Products
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'TopStore Signature Hoodie',
    description: 'Heavyweight cotton hoodie with embroidered logo. Oversized fit for maximum comfort and style. Made in Belarus.',
    price: 4500,
    category: 'Hoodies',
    images: ['https://picsum.photos/id/447/800/1000', 'https://picsum.photos/id/338/800/1000'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red'],
    inStock: true,
    weightKg: 0.8
  },
  {
    id: '2',
    name: 'Tactical Cargo Pants',
    description: 'Durable tech-wear pants with multiple pockets. Water-resistant fabric.',
    price: 3800,
    category: 'Pants',
    images: ['https://picsum.photos/id/1/800/1000', 'https://picsum.photos/id/1005/800/1000'],
    sizes: ['30', '32', '34', '36'],
    colors: ['Black', 'Camo'],
    inStock: true,
    weightKg: 0.6
  },
  {
    id: '3',
    name: 'Essential Tee',
    description: 'Premium organic cotton t-shirt. Breathable and soft against the skin.',
    price: 1900,
    category: 'T-Shirts',
    images: ['https://picsum.photos/id/1059/800/1000'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Red'],
    inStock: true,
    weightKg: 0.2
  },
  {
    id: '4',
    name: 'Silk Evening Dress',
    description: 'Elegant red silk dress for special occasions.',
    price: 8500,
    category: 'Dresses',
    images: ['https://picsum.photos/id/325/800/1000'],
    sizes: ['XS', 'S', 'M'],
    colors: ['Red'],
    inStock: true,
    weightKg: 0.4
  }
];

// Mock CDEK API Calculation
// Simulates a call to CDEK API (Minsk -> Destination)
export const calculateShipping = async (city: string, weight: number): Promise<DeliveryOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate price logic based on "distance" (randomized by city length hash) and weight
      const basePrice = 300 + (city.length * 10); 
      const weightFactor = weight * 100;
      
      const options: DeliveryOption[] = [
        {
          id: 'cdek-pvz',
          name: 'СДЭК: Пункт выдачи',
          price: Math.floor(basePrice + weightFactor),
          daysMin: 3,
          daysMax: 5,
          type: 'point'
        },
        {
          id: 'cdek-courier',
          name: 'СДЭК: Курьер до двери',
          price: Math.floor((basePrice + weightFactor) * 1.5),
          daysMin: 2,
          daysMax: 4,
          type: 'courier'
        },
        {
          id: 'cdek-super',
          name: 'СДЭК: Супер-экспресс',
          price: Math.floor((basePrice + weightFactor) * 2.5),
          daysMin: 1,
          daysMax: 2,
          type: 'courier'
        }
      ];
      resolve(options);
    }, 800); // Simulate network delay
  });
};

// Mock Payment Gateway
export const processPayment = async (amount: number, cardDetails: any): Promise<{ success: boolean; transactionId: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      });
    }, 1500);
  });
};

// Mock Admin Notification (Simulating Telegram Bot/Email)
export const notifyAdmin = (order: any) => {
  console.log("------------------------------------------------");
  console.log("🔔 NEW ORDER NOTIFICATION (TELEGRAM/EMAIL MOCK)");
  console.log(`Order ID: ${order.id}`);
  console.log(`Customer: ${order.userDetails.fullName} (${order.userDetails.phone})`);
  console.log(`Address: ${order.userDetails.city}, ${order.userDetails.address}`);
  console.log(`Amount: ${order.totalAmount} RUB (Paid)`);
  console.log(`Delivery: ${order.delivery.method.name}`);
  console.log("------------------------------------------------");
};