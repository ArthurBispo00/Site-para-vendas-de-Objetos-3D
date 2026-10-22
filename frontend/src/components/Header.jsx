import { LayoutDashboard, Lock } from 'lucide-react';
import Logo from './Logo';

const NOTICES = [
  'Impressão em alta qualidade',
  'Personalização sob consulta',
  'Pedido direto pelo WhatsApp',
];

export default function Header({ isAuthenticated = false, onAdminClick }) {
  const Icon = isAuthenticated ? LayoutDashboard : Lock;

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#topo"
          aria-label="Jaca 3D, feito camada por camada. Ir para o início"
          className="flex items-center gap-3 rounded-lg"
        >
          <Logo className="h-16 w-16" alt="" />
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ink/70">
            Feito camada
            <br className="sm:hidden" /> por camada
          </p>
        </a>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full bg-jaca-50 px-3 py-1.5 text-xs font-medium text-jaca-700 sm:inline-flex">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-jaca-600" />
            Encomendas abertas
          </span>
          <button
            type="button"
            onClick={onAdminClick}
            className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gold-100"
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {isAuthenticated ? 'Painel admin' : 'Login Admin'}
          </button>
        </div>
      </div>

      <div className="bg-ink text-white">
        <ul
          aria-label="Avisos da loja"
          className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-xs font-medium"
        >
          {NOTICES.map((notice, index) => (
            <li key={notice} className="flex items-center gap-6">
              {notice}
              {index < NOTICES.length - 1 && (
                <span aria-hidden="true" className="hidden h-1.5 w-1.5 rounded-full bg-gold-400 sm:inline-block" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
