import ProductCard from './ProductCard';

function Skeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-card" aria-hidden="true">
      <div className="aspect-[4/3] bg-ink/10" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 rounded bg-ink/10" />
        <div className="h-3 w-full rounded bg-ink/10" />
        <div className="h-10 rounded-xl bg-ink/10" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading = false, error = null, onRetry }) {
  if (loading) {
    return (
      <div role="status" aria-label="Carregando produtos" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-800">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            Tentar de novo
          </button>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-10 text-center text-ink/75 shadow-card">
        Nenhuma peça encontrada. Tente outra busca ou categoria.
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
