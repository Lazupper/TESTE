import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import OrderTracker from '@/components/OrderTracker';
import { useCartStore } from '@/lib/store';

const Tracking = () => {
  const { orderId } = useParams();
  const orders = useCartStore((s) => s.orders);
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto flex flex-col items-center px-4 py-20">
          <h2 className="text-xl font-bold text-foreground">Pedido não encontrado</h2>
          <p className="mt-2 text-muted-foreground">Verifique o número do pedido</p>
          <Link
            to="/"
            className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
          >
            Voltar ao cardápio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-lg px-4 py-6">
        <Link to="/" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar ao cardápio
        </Link>

        <h2 className="mb-6 text-2xl font-bold text-foreground">Acompanhar Pedido</h2>
        <OrderTracker order={order} />
      </main>
    </div>
  );
};

export default Tracking;
