import { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { Product, CustomizationOption, CartItemCustomization, useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductCustomizationDialog = ({ product, open, onOpenChange }: Props) => {
  const addItem = useCartStore((s) => s.addItem);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [addedExtras, setAddedExtras] = useState<CustomizationOption[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const toggleIngredient = (ingredient: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient]
    );
  };

  const toggleExtra = (extra: CustomizationOption) => {
    setAddedExtras((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const extrasTotal = addedExtras.reduce((sum, e) => sum + e.price, 0);
  const unitPrice = product.price + extrasTotal;
  const total = unitPrice * quantity;

  const handleAdd = () => {
    const customization: CartItemCustomization = {
      removedIngredients,
      addedExtras,
      notes,
    };
    addItem(product, customization, quantity);
    toast.success(`${product.name} adicionado ao carrinho!`);
    // Reset state
    setRemovedIngredients([]);
    setAddedExtras([]);
    setNotes('');
    setQuantity(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-4xl">{product.image}</span>
            <div>
              <p className="text-lg">{product.name}</p>
              <p className="text-sm font-normal text-muted-foreground">{product.description}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Ingredients - remove */}
          {product.ingredients.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-foreground uppercase tracking-wide">
                Ingredientes <span className="text-muted-foreground font-normal normal-case">(desmarque para retirar)</span>
              </h4>
              <div className="space-y-1">
                {product.ingredients.map((ing) => {
                  const isRemoved = removedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      onClick={() => toggleIngredient(ing)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isRemoved
                          ? 'bg-destructive/10 text-muted-foreground line-through'
                          : 'bg-secondary/50 text-foreground'
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                          isRemoved
                            ? 'border-muted-foreground/30 bg-transparent'
                            : 'border-primary bg-primary text-primary-foreground'
                        }`}
                      >
                        {!isRemoved && <Check className="h-3 w-3" />}
                      </div>
                      {ing}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extras - add */}
          {product.extras.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-foreground uppercase tracking-wide">
                Extras
              </h4>
              <div className="space-y-1">
                {product.extras.map((extra) => {
                  const isAdded = addedExtras.find((e) => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtra(extra)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                        isAdded
                          ? 'bg-primary/10 text-foreground'
                          : 'bg-secondary/50 text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                            isAdded
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground/30 bg-transparent'
                          }`}
                        >
                          {isAdded && <Check className="h-3 w-3" />}
                        </div>
                        {extra.name}
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        +R$ {extra.price.toFixed(2).replace('.', ',')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground uppercase tracking-wide">
              Observações
            </h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: sem cebola, ponto da carne mal passado..."
              rows={2}
              className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Quantity + Add */}
          <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-bold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-transform hover:opacity-90 active:scale-[0.98]"
            >
              Adicionar · R$ {total.toFixed(2).replace('.', ',')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizationDialog;
