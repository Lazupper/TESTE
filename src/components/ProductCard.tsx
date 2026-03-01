import { Plus } from 'lucide-react';
import { Product, useCartStore } from '@/lib/store';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold text-card-foreground">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>
        <p className="mt-2 text-lg font-bold text-primary">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
      </div>
      <div className="relative flex flex-col items-center justify-between">
        <span className="text-4xl">{product.image}</span>
        <button
          onClick={handleAdd}
          className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
