import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { products } from '@/lib/store';
import heroImage from '@/assets/hero-food.jpg';

const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative h-64 overflow-hidden sm:h-80">
        <img
          src={heroImage}
          alt="Comida deliciosa"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Peça agora, <span className="text-gradient">receba rápido</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Os melhores restaurantes na palma da sua mão
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar pratos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Categories */}
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Products Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground">Nenhum item encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
