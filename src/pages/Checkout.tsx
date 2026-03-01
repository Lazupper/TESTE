import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, QrCode } from 'lucide-react';
import Header from '@/components/Header';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

const Checkout = () => {
  const { items, getTotal, clearCart, addOrder } = useCartStore();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const total = getTotal();
  const deliveryFee = 5.99;
  const finalTotal = total + deliveryFee;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !address.trim()) {
      toast.error('Preencha nome e endereço');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      toast.error('Preencha os dados do cartão');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const order = addOrder({
        items: [...items],
        total: finalTotal,
        paymentMethod,
        address,
        customerName: name,
      });
      clearCart();
      toast.success('Pedido realizado com sucesso!');
      navigate(`/tracking/${order.id}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-lg px-4 py-6">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <h2 className="mb-6 text-2xl font-bold text-foreground">Finalizar Pedido</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Dados de entrega</h3>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Endereço completo"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Payment method */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Forma de pagamento</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 font-medium transition-all ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                Cartão
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 font-medium transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                }`}
              >
                <QrCode className="h-5 w-5" />
                PIX
              </button>
            </div>
          </div>

          {/* Card form */}
          {paymentMethod === 'card' && (
            <div className="space-y-3 animate-fade-in">
              <input
                type="text"
                placeholder="Número do cartão"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                    setCardExpiry(v);
                  }}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* PIX info */}
          {paymentMethod === 'pix' && (
            <div className="animate-fade-in rounded-xl border border-border bg-card p-6 text-center">
              <QrCode className="mx-auto h-24 w-24 text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">
                O QR Code será gerado após a confirmação do pedido
              </p>
            </div>
          )}

          {/* Summary */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">
                R$ {finalTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl gradient-primary py-4 font-bold text-primary-foreground transition-all hover:opacity-90 glow-primary disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Confirmar Pedido'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
