import { filterProducts, normalizeText } from '../utils/filterProducts';

const products = [
  { id: '1', nome: 'Vaso Twist', descricao: 'Design orgânico', categoria: 'Decoração' },
  { id: '2', nome: 'Dragão Articulado', descricao: 'Peça flexível em PLA', categoria: 'Colecionáveis' },
  { id: '3', nome: 'Castelo Medieval', descricao: 'Miniatura para RPG', categoria: 'Miniaturas' },
];

describe('filterProducts', () => {
  it('devolve tudo quando não há filtros', () => {
    expect(filterProducts(products)).toHaveLength(3);
  });

  it('filtra pelo nome ignorando acentos e maiúsculas', () => {
    const result = filterProducts(products, { query: 'DRAGAO' });
    expect(result.map((p) => p.id)).toEqual(['2']);
  });

  it('filtra pela descrição', () => {
    expect(filterProducts(products, { query: 'rpg' }).map((p) => p.id)).toEqual(['3']);
  });

  it('filtra por categoria', () => {
    expect(filterProducts(products, { category: 'Decoração' }).map((p) => p.id)).toEqual(['1']);
  });

  it('combina busca e categoria', () => {
    expect(filterProducts(products, { query: 'vaso', category: 'Miniaturas' })).toEqual([]);
  });
});

describe('normalizeText', () => {
  it('remove acentos e coloca em minúsculas', () => {
    expect(normalizeText('  Decoração ')).toBe('decoracao');
  });
});
