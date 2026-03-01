import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  items: CartItem[];
  total: number;
  status: 'confirmed' | 'preparing' | 'delivering' | 'delivered';
  paymentMethod: 'card' | 'pix';
  createdAt: Date;
  address: string;
  customerName: string;
}

interface CartStore {
  items: CartItem[];
  orders: Order[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

let orderCounter = 1000;

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  orders: [],
  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    });
  },
  removeItem: (productId) => {
    set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }));
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  addOrder: (orderData) => {
    orderCounter++;
    const order: Order = {
      ...orderData,
      id: crypto.randomUUID(),
      orderNumber: orderCounter,
      createdAt: new Date(),
      status: 'confirmed',
    };
    set((state) => ({ orders: [...state.orders, order] }));
    // Simulate status progression
    setTimeout(() => get().updateOrderStatus(order.id, 'preparing'), 5000);
    setTimeout(() => get().updateOrderStatus(order.id, 'delivering'), 15000);
    setTimeout(() => get().updateOrderStatus(order.id, 'delivered'), 30000);
    return order;
  },
  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  },
}));

export const products: Product[] = [
  { id: '1', name: 'Smash Burger Duplo', description: 'Dois blends de 90g, cheddar, bacon crocante, molho especial', price: 32.90, image: '🍔', category: 'Burgers' },
  { id: '2', name: 'Burger Clássico', description: 'Blend 150g, queijo, alface, tomate, picles', price: 26.90, image: '🍔', category: 'Burgers' },
  { id: '3', name: 'Pizza Margherita', description: 'Molho de tomate, mussarela de búfala, manjericão fresco', price: 45.90, image: '🍕', category: 'Pizzas' },
  { id: '4', name: 'Pizza Pepperoni', description: 'Pepperoni artesanal, mussarela, orégano', price: 49.90, image: '🍕', category: 'Pizzas' },
  { id: '5', name: 'Combo Sushi 20 peças', description: 'Hot roll, uramaki, nigiri variados', price: 59.90, image: '🍣', category: 'Japonesa' },
  { id: '6', name: 'Temaki Salmão', description: 'Salmão fresco, cream cheese, cebolinha', price: 28.90, image: '🍣', category: 'Japonesa' },
  { id: '7', name: 'Açaí 500ml', description: 'Açaí cremoso com granola, banana e leite condensado', price: 22.90, image: '🫐', category: 'Sobremesas' },
  { id: '8', name: 'Petit Gateau', description: 'Bolo de chocolate com centro derretido e sorvete', price: 24.90, image: '🍫', category: 'Sobremesas' },
  { id: '9', name: 'Refrigerante 350ml', description: 'Coca-Cola, Guaraná ou Sprite', price: 6.90, image: '🥤', category: 'Bebidas' },
  { id: '10', name: 'Suco Natural 500ml', description: 'Laranja, abacaxi com hortelã ou maracujá', price: 12.90, image: '🧃', category: 'Bebidas' },
];
