import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem, useCartStore } from '@/lib/store';

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <span className="text-3xl">{item.product.image}</span>
      <div className="flex-1">
        <h4 className="font-semibold text-card-foreground">{item.product.name}</h4>
        <p className="text-sm text-primary font-bold">
          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-6 text-center font-semibold text-foreground">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-3 w-3" />
        </button>
        <button
          onClick={() => removeItem(item.product.id)}
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
