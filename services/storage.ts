import { Order, OrderStatus, Product, User } from '../types';
import { PRODUCTS } from './mockData';

const STORAGE_KEYS = {
  ORDERS: 'freshmarket_orders',
  USER: 'freshmarket_user',
  CART: 'freshmarket_cart'
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const StorageService = {
  getProducts: async (): Promise<Product[]> => {
    await delay(300);
    return PRODUCTS;
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay(100);
    return PRODUCTS.find(p => p.id === id);
  },

  getOrders: async (): Promise<Order[]> => {
    await delay(500);
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return stored ? JSON.parse(stored) : [];
  },

  createOrder: async (order: Order): Promise<void> => {
    await delay(800);
    const orders = await StorageService.getOrders();
    orders.unshift(order); // Add to top
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    await delay(500);
    const orders = await StorageService.getOrders();
    const updatedOrders = orders.map(o => 
      o.id === orderId ? { ...o, status } : o
    );
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
  },

  getUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  },

  saveUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};