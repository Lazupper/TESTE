import { create } from 'zustand';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number; // 0 for free, positive for extras
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[]; // removable ingredients
  extras: CustomizationOption[]; // paid extras
}

export interface CartItemCustomization {
  removedIngredients: string[];
  addedExtras: CustomizationOption[];
  notes: string;
}

export interface CartItem {
  cartItemId: string; // unique per cart entry (same product can appear with different customizations)
  product: Product;
  quantity: number;
  customization: CartItemCustomization;
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
  addItem: (product: Product, customization?: CartItemCustomization, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

let orderCounter = 1000;

const defaultCustomization: CartItemCustomization = { removedIngredients: [], addedExtras: [], notes: '' };

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  orders: [],
  addItem: (product, customization = defaultCustomization, qty = 1) => {
    set((state) => ({
      items: [...state.items, {
        cartItemId: crypto.randomUUID(),
        product,
        quantity: qty,
        customization,
      }],
    }));
  },
  removeItem: (cartItemId) => {
    set((state) => ({ items: state.items.filter((i) => i.cartItemId !== cartItemId) }));
  },
  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity } : i
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => get().items.reduce((sum, i) => {
    const extrasTotal = i.customization.addedExtras.reduce((s, e) => s + e.price, 0);
    return sum + (i.product.price + extrasTotal) * i.quantity;
  }, 0),
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
  {
    id: '1', name: 'Smash Burger Duplo', description: 'Dois blends de 90g, cheddar, bacon crocante, molho especial', price: 32.90, image: '🍔', category: 'Burgers',
    ingredients: ['Pão brioche', 'Blend 90g (x2)', 'Cheddar', 'Bacon crocante', 'Molho especial', 'Cebola caramelizada'],
    extras: [
      { id: 'e1', name: 'Blend extra', price: 8.00 },
      { id: 'e2', name: 'Bacon extra', price: 5.00 },
      { id: 'e3', name: 'Ovo', price: 3.00 },
      { id: 'e4', name: 'Cheddar extra', price: 4.00 },
    ],
  },
  {
    id: '2', name: 'Burger Clássico', description: 'Blend 150g, queijo, alface, tomate, picles', price: 26.90, image: '🍔', category: 'Burgers',
    ingredients: ['Pão gergelim', 'Blend 150g', 'Queijo', 'Alface', 'Tomate', 'Picles', 'Maionese'],
    extras: [
      { id: 'e5', name: 'Blend extra', price: 8.00 },
      { id: 'e6', name: 'Bacon', price: 5.00 },
      { id: 'e7', name: 'Cheddar', price: 4.00 },
    ],
  },
  {
    id: '3', name: 'Pizza Margherita', description: 'Molho de tomate, mussarela de búfala, manjericão fresco', price: 45.90, image: '🍕', category: 'Pizzas',
    ingredients: ['Massa artesanal', 'Molho de tomate', 'Mussarela de búfala', 'Manjericão fresco', 'Azeite'],
    extras: [
      { id: 'e8', name: 'Borda recheada', price: 6.00 },
      { id: 'e9', name: 'Mussarela extra', price: 5.00 },
    ],
  },
  {
    id: '4', name: 'Pizza Pepperoni', description: 'Pepperoni artesanal, mussarela, orégano', price: 49.90, image: '🍕', category: 'Pizzas',
    ingredients: ['Massa artesanal', 'Molho de tomate', 'Mussarela', 'Pepperoni', 'Orégano'],
    extras: [
      { id: 'e10', name: 'Borda recheada', price: 6.00 },
      { id: 'e11', name: 'Pepperoni extra', price: 7.00 },
      { id: 'e12', name: 'Cebola', price: 2.00 },
    ],
  },
  {
    id: '5', name: 'Combo Sushi 20 peças', description: 'Hot roll, uramaki, nigiri variados', price: 59.90, image: '🍣', category: 'Japonesa',
    ingredients: ['Hot roll (5un)', 'Uramaki (8un)', 'Nigiri salmão (4un)', 'Nigiri atum (3un)'],
    extras: [
      { id: 'e13', name: 'Sashimi salmão (5un)', price: 12.00 },
      { id: 'e14', name: 'Guioza (5un)', price: 10.00 },
      { id: 'e15', name: 'Molho tarê extra', price: 2.00 },
    ],
  },
  {
    id: '6', name: 'Temaki Salmão', description: 'Salmão fresco, cream cheese, cebolinha', price: 28.90, image: '🍣', category: 'Japonesa',
    ingredients: ['Alga nori', 'Arroz', 'Salmão fresco', 'Cream cheese', 'Cebolinha'],
    extras: [
      { id: 'e16', name: 'Salmão extra', price: 6.00 },
      { id: 'e17', name: 'Crispy', price: 2.00 },
    ],
  },
  {
    id: '7', name: 'Açaí 500ml', description: 'Açaí cremoso com granola, banana e leite condensado', price: 22.90, image: '🫐', category: 'Sobremesas',
    ingredients: ['Açaí', 'Granola', 'Banana', 'Leite condensado'],
    extras: [
      { id: 'e18', name: 'Morango', price: 3.00 },
      { id: 'e19', name: 'Paçoca', price: 2.00 },
      { id: 'e20', name: 'Leite Ninho', price: 3.00 },
    ],
  },
  {
    id: '8', name: 'Petit Gateau', description: 'Bolo de chocolate com centro derretido e sorvete', price: 24.90, image: '🍫', category: 'Sobremesas',
    ingredients: ['Bolo de chocolate', 'Centro derretido', 'Sorvete de creme'],
    extras: [
      { id: 'e21', name: 'Calda de caramelo', price: 2.00 },
      { id: 'e22', name: 'Sorvete extra', price: 4.00 },
    ],
  },
  {
    id: '9', name: 'Refrigerante 350ml', description: 'Coca-Cola, Guaraná ou Sprite', price: 6.90, image: '🥤', category: 'Bebidas',
    ingredients: [], extras: [],
  },
  {
    id: '10', name: 'Suco Natural 500ml', description: 'Laranja, abacaxi com hortelã ou maracujá', price: 12.90, image: '🧃', category: 'Bebidas',
    ingredients: [], extras: [],
  },
];
