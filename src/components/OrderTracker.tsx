import { CheckCircle2, ChefHat, Truck, Package } from 'lucide-react';
import { Order } from '@/lib/store';

interface OrderTrackerProps {
  order: Order;
}

const steps = [
  { status: 'confirmed', label: 'Pedido Confirmado', icon: CheckCircle2 },
  { status: 'preparing', label: 'Preparando', icon: ChefHat },
  { status: 'delivering', label: 'Saiu para Entrega', icon: Truck },
  { status: 'delivered', label: 'Entregue', icon: Package },
] as const;

const statusIndex = { confirmed: 0, preparing: 1, delivering: 2, delivered: 3 };

const OrderTracker = ({ order }: OrderTrackerProps) => {
  const currentIndex = statusIndex[order.status];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Pedido</p>
          <p className="text-2xl font-bold text-gradient">#{order.orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {order.paymentMethod === 'pix' ? 'PIX' : 'Cartão'}
          </p>
          <p className="font-bold text-primary">
            R$ {order.total.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-5 top-5 h-[calc(100%-40px)] w-0.5 bg-border" />
        <div
          className="absolute left-5 top-5 w-0.5 bg-primary transition-all duration-1000"
          style={{ height: `${(currentIndex / 3) * 100}%`, maxHeight: 'calc(100% - 40px)' }}
        />

        <div className="space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i <= currentIndex;
            const isCurrent = i === currentIndex;

            return (
              <div key={step.status} className="relative flex items-center gap-4">
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    isCurrent
                      ? 'gradient-primary text-primary-foreground animate-pulse-glow'
                      : isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`font-medium transition-colors ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-secondary p-4">
        <p className="text-sm text-muted-foreground">Endereço de entrega</p>
        <p className="font-medium text-secondary-foreground">{order.address}</p>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Itens do pedido</p>
        {order.items.map((item) => (
          <div key={item.product.id} className="flex justify-between text-sm">
            <span className="text-foreground">
              {item.quantity}x {item.product.name}
            </span>
            <span className="text-muted-foreground">
              R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracker;
