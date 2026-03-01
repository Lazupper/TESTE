import { ShoppingCart, MapPin, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/lib/store';

const Header = () => {
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="text-xl font-bold text-gradient">DeliverFast</span>
        </Link>

        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Entrega para sua região</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Pedidos</span>
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Carrinho</span>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
