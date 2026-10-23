import { parseDecimal, parseWeight, validateLogin, validateProduct } from '../utils/validation';

const valid = {
  nome: 'Vaso geométrico',
  descricao: 'Vaso decorativo com acabamento fosco.',
  categoria: 'Decoração',
  gramatura: '150g',
  preco: '49,90',
  imagem: null,
};

describe('parseDecimal / parseWeight', () => {
  it('entende números no formato brasileiro', () => {
    expect(parseDecimal('49,90')).toBe(49.9);
    expect(parseDecimal('R$ 1.234,56')).toBe(1234.56);
    expect(parseDecimal('abc')).toBeNaN();
  });

  it('extrai gramas de textos como "150g"', () => {
    expect(parseWeight('150g')).toBe(150);
    expect(parseWeight('')).toBeNaN();
  });
});

describe('validateProduct', () => {
  it('aceita um produto válido', () => {
    expect(validateProduct(valid)).toEqual({});
  });

  it('exige todos os campos obrigatórios', () => {
    const errors = validateProduct({ nome: '', descricao: '', categoria: '', gramatura: '', preco: '' });
    expect(Object.keys(errors).sort()).toEqual(['categoria', 'descricao', 'gramatura', 'nome', 'preco']);
  });

  it('rejeita preço zerado ou negativo', () => {
    expect(validateProduct({ ...valid, preco: '0' }).preco).toBeDefined();
    expect(validateProduct({ ...valid, preco: '-5' }).preco).toBeDefined();
  });

  it('rejeita imagem com formato inválido ou maior que 5 MB', () => {
    const gif = new File(['x'], 'a.gif', { type: 'image/gif' });
    expect(validateProduct({ ...valid, imagem: gif }).imagem).toMatch(/JPG, PNG ou WebP/);

    const big = new File(['x'], 'a.png', { type: 'image/png' });
    Object.defineProperty(big, 'size', { value: 6 * 1024 * 1024 });
    expect(validateProduct({ ...valid, imagem: big }).imagem).toMatch(/5 MB/);
  });
});

describe('validateLogin', () => {
  it('exige usuário e senha', () => {
    expect(validateLogin({ usuario: ' ', senha: '' })).toEqual({
      usuario: expect.any(String),
      senha: expect.any(String),
    });
    expect(validateLogin({ usuario: 'admin', senha: '123' })).toEqual({});
  });
});
