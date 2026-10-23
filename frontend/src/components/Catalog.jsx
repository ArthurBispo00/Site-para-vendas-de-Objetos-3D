import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FILTERS, FILTER_ALL } from '../utils/constants';
import { filterProducts } from '../utils/filterProducts';
import ProductGrid from './ProductGrid';

export default function Catalog({ products, loading, error, onRetry }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(FILTER_ALL);

  const visible = useMemo(
    () => filterProducts(products, { query, category }),
    [products, query, category],
  );

  const count = visible.length;

  return (
    <section id="catalogo" aria-labelledby="catalogo-titulo" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="lg:w-56 lg:shrink-0">
          <h2 id="catalogo-titulo" className="text-3xl font-extrabold leading-tight">
            Explore o catálogo
          </h2>
          <p className="mt-1 text-sm text-ink/70" role="status" aria-live="polite">
            {loading ? 'Carregando peças…' : `${count} ${count === 1 ? 'peça disponível' : 'peças disponíveis'} para você`}
          </p>
        </div>

        <div className="flex-1">
          <div role="search">
            <label htmlFor="busca" className="sr-only">
              Buscar por nome ou descrição
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/60"
              />
              <input
                id="busca"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou descrição..."
                className="w-full rounded-xl border border-ink/15 bg-white py-3 pl-11 pr-4 text-sm placeholder:text-ink/60"
              />
            </div>
          </div>

          <div role="group" aria-label="Filtrar por categoria" className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((name) => {
              const selected = name === category;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCategory(name)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    selected
                      ? 'border-jaca-600 bg-jaca-600 text-white'
                      : 'border-ink/15 bg-white hover:border-jaca-600'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ProductGrid products={visible} loading={loading} error={error} onRetry={onRetry} />
      </div>
    </section>
  );
}
