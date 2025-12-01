export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address?: string;
  phone?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  unit: string; // e.g., 'kg', 'unit', 'pack'
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'received' | 'picking' | 'shipping' | 'delivered';

export interface OrderItem {
  id: string; // usually product id
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO Date string
  shippingAddress: {
    address: string;
    reference?: string;
    phone: string;
  };
}