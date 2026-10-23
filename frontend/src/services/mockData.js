import { makePlaceholder } from '../utils/image';

// Dados fictícios usados enquanto o back-end não está pronto.
export const MOCK_CREDENTIALS = { usuario: 'admin', senha: 'admin' };

export const seedProducts = () => [
  {
    id: 'p1',
    nome: 'Vaso Twist',
    descricao: 'Design orgânico com acabamento acetinado para deixar qualquer ambiente mais especial.',
    categoria: 'Decoração',
    gramatura: 180,
    preco: 42.9,
    imagemUrl: makePlaceholder('Vaso Twist', '#6d3f8f', '#c9a2e0'),
  },
  {
    id: 'p2',
    nome: 'Dragão Articulado',
    descricao: 'Peça flexível e cheia de personalidade, impressa em PLA com detalhes precisos.',
    categoria: 'Colecionáveis',
    gramatura: 95,
    preco: 34.9,
    imagemUrl: makePlaceholder('Dragão Articulado', '#2a7a49', '#a6e3b8'),
  },
  {
    id: 'p3',
    nome: 'Castelo Medieval',
    descricao: 'Miniatura rica em detalhes para decoração, cenários de RPG ou coleção.',
    categoria: 'Miniaturas',
    gramatura: 240,
    preco: 68,
    imagemUrl: makePlaceholder('Castelo Medieval', '#3b4650', '#9aa7b2'),
  },
  {
    id: 'p4',
    nome: 'Kit Desk Buddies',
    descricao: 'Mini bonecos coloridos para alegrar a mesa de trabalho. Ótima opção de presente.',
    categoria: 'Presentes',
    gramatura: 120,
    preco: 39.9,
    imagemUrl: makePlaceholder('Kit Desk Buddies', '#e8b410', '#fff1b8'),
  },
  {
    id: 'p5',
    nome: 'Caveira Geométrica',
    descricao: 'Escultura low poly com acabamento fosco, perfeita para estantes e escritórios.',
    categoria: 'Decoração',
    gramatura: 210,
    preco: 54.9,
    imagemUrl: makePlaceholder('Caveira Geométrica', '#7a3b3b', '#e0a2a2'),
  },
  {
    id: 'p6',
    nome: 'Barquinhos Modulares',
    descricao: 'Conjunto de barquinhos encaixáveis que flutuam. Diversão garantida na banheira.',
    categoria: 'Miniaturas',
    gramatura: 75,
    preco: 29.9,
    imagemUrl: makePlaceholder('Barquinhos Modulares', '#1f5fbf', '#9cc4ff'),
  },
];
