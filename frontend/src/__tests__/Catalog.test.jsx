import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Catalog from '../components/Catalog';

const products = [
  { id: '1', nome: 'Vaso Twist', descricao: 'Design orgânico', categoria: 'Decoração', gramatura: 180, preco: 42.9, imagemUrl: 'a.png' },
  { id: '2', nome: 'Dragão Articulado', descricao: 'Peça flexível em PLA', categoria: 'Colecionáveis', gramatura: 95, preco: 34.9, imagemUrl: 'b.png' },
  { id: '3', nome: 'Castelo Medieval', descricao: 'Miniatura para RPG', categoria: 'Miniaturas', gramatura: 240, preco: 68, imagemUrl: 'c.png' },
];

const setup = () => render(<Catalog products={products} loading={false} error={null} />);

describe('<Catalog />', () => {
  it('mostra todos os produtos e a contagem', () => {
    setup();
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByText(/3 peças disponíveis/i)).toBeInTheDocument();
  });

  it('a busca filtra os produtos pelo nome', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(screen.getByRole('searchbox', { name: /buscar por nome ou descrição/i }), 'dragao');

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Dragão Articulado' })).toBeInTheDocument();
    expect(screen.getByText(/1 peça disponível/i)).toBeInTheDocument();
  });

  it('o filtro de categoria mostra só os itens da categoria', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: 'Miniaturas' }));

    expect(screen.getByRole('button', { name: 'Miniaturas' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Castelo Medieval' })).toBeInTheDocument();
  });

  it('mostra mensagem quando nada é encontrado', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(screen.getByRole('searchbox'), 'xyz');
    expect(screen.getByText(/nenhuma peça encontrada/i)).toBeInTheDocument();
  });

  it('cada card tem link do WhatsApp com a mensagem do produto', () => {
    setup();
    const link = screen.getByRole('link', { name: /pedir vaso twist pelo whatsapp/i });
    expect(link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/5511999999999\?text=/);
    expect(decodeURIComponent(link.getAttribute('href'))).toContain('Vaso Twist');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
});
