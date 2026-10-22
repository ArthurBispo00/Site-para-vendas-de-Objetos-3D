import { Check, ShoppingBag } from 'lucide-react';

export default function Hero() {
  return (
    <section id="topo" aria-labelledby="hero-titulo" className="relative overflow-hidden bg-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-300/40"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-700">
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
            Impressos com cuidado, feitos para durar
          </p>
          <h1 id="hero-titulo" className="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Ideias que ganham <span className="text-jaca-600">forma.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/80">
            Objetos únicos, produzidos camada por camada com tecnologia, criatividade e um toque
            artesanal.
          </p>
        </div>

        <aside
          aria-label="Como pedir"
          className="flex w-full max-w-sm items-center gap-4 rounded-2xl bg-white p-4 shadow-card"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-jaca-600 text-white">
            <ShoppingBag aria-hidden="true" className="h-6 w-6" />
          </span>
          <div>
            <p className="font-bold">Encontrou o que procura?</p>
            <p className="text-sm text-ink/70">
              Clique no produto e fale diretamente com a gente.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
