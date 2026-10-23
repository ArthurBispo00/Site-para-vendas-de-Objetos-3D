import { MessageCircle } from 'lucide-react';
import { formatPrice, formatWeight } from '../utils/formatters';
import { buildWhatsAppLink } from '../utils/whatsapp';

export default function ProductCard({ product }) {
  const { nome, descricao, categoria, gramatura, preco, imagemUrl } = product;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-cream">
        <img
          src={imagemUrl}
          alt={`Foto do produto ${nome}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {categoria && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow-sm">
            {categoria}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{nome}</h3>
        <p className="mt-2 flex-1 text-sm text-ink/75">{descricao}</p>

        <p className="mt-4">
          <span className="inline-block rounded-full bg-ink/5 px-3 py-1 text-xs font-medium">
            Peso: {formatWeight(gramatura)}
          </span>
        </p>

        <p className="mt-4 text-xs text-ink/70">A partir de</p>
        <p className="text-2xl font-extrabold">{formatPrice(preco)}</p>

        <a
          href={buildWhatsAppLink(product)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Pedir ${nome} pelo WhatsApp (abre em nova aba)`}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-jaca-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-jaca-700"
        >
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          Pedir pelo WhatsApp
        </a>
      </div>
    </article>
  );
}
