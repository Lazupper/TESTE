import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem, useCartStore } from '@/lib/store';

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, removeItem } = useCartStore();
  const extrasTotal = item.customization.addedExtras.reduce((s, e) => s + e.price, 0);
  const unitPrice = item.product.price + extrasTotal;

  const hasCustomization =
    item.customization.removedIngredients.length > 0 ||
    item.customization.addedExtras.length > 0 ||
    item.customization.notes;

  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
      <span className="text-3xl mt-1">{item.product.image}</span>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-card-foreground">{item.product.name}</h4>
        {hasCustomization && (
          <div className="mt-1 space-y-0.5">
            {item.customization.removedIngredients.length > 0 && (
              <p className="text-xs text-destructive">
                Sem: {item.customization.removedIngredients.join(', ')}
              </p>
            )}
            {item.customization.addedExtras.length > 0 && (
              <p className="text-xs text-primary">
                + {item.customization.addedExtras.map((e) => e.name).join(', ')}
              </p>
            )}
            {item.customization.notes && (
              <p className="text-xs text-muted-foreground italic">"{item.customization.notes}"</p>
            )}
          </div>
        )}
        <p className="mt-1 text-sm text-primary font-bold">
          R$ {(unitPrice * item.quantity).toFixed(2).replace('.', ',')}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-6 text-center font-semibold text-foreground">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-3 w-3" />
        </button>
        <button
          onClick={() => removeItem(item.cartItemId)}
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
