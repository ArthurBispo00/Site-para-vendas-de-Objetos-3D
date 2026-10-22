import {
  createProduct,
  deleteProduct,
  getProducts,
  login,
  normalizeProduct,
  toUserMessage,
} from '../services/apiService';

// Nos testes, appConfig.js é o mock com API_MODE = 'mock' (veja jest.config.cjs).
describe('apiService (modo mock)', () => {
  it('lista os 6 produtos iniciais', async () => {
    const list = await getProducts();
    expect(list).toHaveLength(6);
    expect(list[0]).toMatchObject({ nome: 'Vaso Twist', gramatura: 180, preco: 42.9 });
  });

  it('cria e remove produtos, persistindo no LocalStorage', async () => {
    const created = await createProduct({
      nome: 'Chaveiro',
      descricao: 'Chaveiro personalizado',
      categoria: 'Presentes',
      gramatura: 10,
      preco: 9.9,
      imagem: null,
    });
    expect((await getProducts())[0].id).toBe(created.id);
    expect(await getProducts()).toHaveLength(7);

    await deleteProduct(created.id);
    expect(await getProducts()).toHaveLength(6);
  });

  it('autentica com as credenciais de teste e rejeita as demais', async () => {
    await expect(login({ usuario: 'admin', senha: 'admin' })).resolves.toHaveProperty('token');
    await expect(login({ usuario: 'admin', senha: 'errada' })).rejects.toMatchObject({
      userMessage: 'Usuário ou senha inválidos.',
    });
  });
});

describe('normalizeProduct / toUserMessage', () => {
  it('aceita nomes de campos alternativos do back-end', () => {
    expect(
      normalizeProduct({ _id: 9, name: 'Peça', description: 'd', category: 'Presentes', weight: '50', price: '12.5', imagem_url: 'u' }),
    ).toEqual({ id: 9, nome: 'Peça', descricao: 'd', categoria: 'Presentes', gramatura: 50, preco: 12.5, imagemUrl: 'u' });
  });

  it('traduz erros HTTP em mensagens amigáveis', () => {
    expect(toUserMessage({ response: { status: 401 } })).toMatch(/inválidos/);
    expect(toUserMessage({})).toMatch(/conectar ao servidor/);
    expect(toUserMessage({ response: { status: 500, data: { message: 'Falha X' } } })).toBe('Falha X');
  });
});
