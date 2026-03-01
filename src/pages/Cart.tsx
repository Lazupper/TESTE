import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import CartItemRow from '@/components/CartItemRow';
import { useCartStore } from '@/lib/store';

const Cart = () => {
  const { items, getTotal } = useCartStore();
  const navigate = useNavigate();
  const total = getTotal();
  const deliveryFee = total > 0 ? 5.99 : 0;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-bold text-foreground">Seu carrinho está vazio</h2>
          <p className="mt-2 text-muted-foreground">Adicione itens deliciosos ao seu pedido</p>
          <Link
            to="/"
            className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
          >
            Ver cardápio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-lg px-4 py-6">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <h2 className="mb-6 text-2xl font-bold text-foreground">Seu Carrinho</h2>

        <div className="space-y-3">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>

        <div className="mt-6 space-y-2 rounded-xl border border-border bg-card p-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Taxa de entrega</span>
            <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="border-t border-border pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">
                R$ {(total + deliveryFee).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/checkout"
          className="mt-6 block w-full rounded-xl gradient-primary py-4 text-center font-bold text-primary-foreground transition-all hover:opacity-90 glow-primary"
        >
          Ir para o pagamento
        </Link>
      </main>
    </div>
  );
};

export default Cart;
