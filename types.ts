export type Category = 'All' | 'T-Shirts' | 'Hoodies' | 'Pants' | 'Accessories' | 'Dresses';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  weightKg: number; // For CDEK calc
}

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  daysMin: number;
  daysMax: number;
  type: 'courier' | 'point';
}

export interface UserDetails {
  fullName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  address: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'New' | 'Paid' | 'Shipped' | 'Delivered';
  items: CartItem[];
  userDetails: UserDetails;
  delivery: {
    method: DeliveryOption;
    cost: number;
  };
  totalAmount: number;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}