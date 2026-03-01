import { Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import Header from '@/components/Header';
import { useCartStore } from '@/lib/store';

const statusLabels = {
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  delivering: 'Em entrega',
  delivered: 'Entregue',
};

const statusColors = {
  confirmed: 'bg-primary/20 text-primary',
  preparing: 'bg-warning/20 text-warning',
  delivering: 'bg-accent/20 text-accent',
  delivered: 'bg-success/20 text-success',
};

const Orders = () => {
  const orders = useCartStore((s) => s.orders);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-lg px-4 py-6">
        <Link to="/" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <h2 className="mb-6 text-2xl font-bold text-foreground">Meus Pedidos</h2>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <Package className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Nenhum pedido realizado</p>
            <Link
              to="/"
              className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
            >
              Fazer pedido
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/tracking/${order.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
              >
                <div>
                  <p className="font-bold text-foreground">#{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} · R${' '}
                    {order.total.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}
                >
                  {statusLabels[order.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
