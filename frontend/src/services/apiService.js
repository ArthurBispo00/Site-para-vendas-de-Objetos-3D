/**
 * Camada de serviço da API.
 *
 * Contrato esperado do back-end (REST/JSON):
 *   POST   /auth/login    body {usuario, senha}                 -> 200 {token, usuario}   | 401
 *   GET    /produtos                                            -> 200 [produto]
 *   POST   /produtos      multipart/form-data                   -> 201 produto            (requer Bearer token)
 *                         campos: nome, descricao, categoria, gramatura, preco, imagem (arquivo, opcional)
 *   DELETE /produtos/:id                                        -> 204                    (requer Bearer token)
 *
 *   produto = { id, nome, descricao, categoria, gramatura (g), preco (R$), imagemUrl }
 *
 * Modo de operação (VITE_API_MODE): 'mock' | 'api' | 'auto' (API real com queda para o mock).
 */
import axios from 'axios';
import { API_BASE_URL, API_MODE } from '../appConfig';
import { makePlaceholder } from '../utils/image';
import { mockCreateProduct, mockDeleteProduct, mockGetProducts, mockLogin } from './mockApi';
import { tokenStorage } from './tokenStorage';

export const http = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

http.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Aceita nomes de campo alternativos, caso o back-end use outro padrão. */
export function normalizeProduct(raw = {}) {
  const nome = raw.nome ?? raw.name ?? '';
  return {
    id: raw.id ?? raw._id,
    nome,
    descricao: raw.descricao ?? raw.description ?? '',
    categoria: raw.categoria ?? raw.category ?? '',
    gramatura: Number(raw.gramatura ?? raw.peso ?? raw.weight ?? 0),
    preco: Number(raw.preco ?? raw.price ?? 0),
    imagemUrl: raw.imagemUrl ?? raw.imagem_url ?? raw.imagem ?? raw.foto ?? makePlaceholder(nome),
  };
}

/** Converte qualquer erro numa mensagem amigável para a interface. */
export function toUserMessage(error) {
  if (error?.userMessage) return error.userMessage;
  const status = error?.response?.status;
  if (!error?.response) return 'Não foi possível conectar ao servidor. Tente novamente.';
  if (status === 401) return 'Usuário ou senha inválidos.';
  if (status === 403) return 'Você não tem permissão para essa ação.';
  return error.response.data?.message || 'Ocorreu um erro inesperado. Tente novamente.';
}

/** Escolhe API real ou mock conforme VITE_API_MODE. */
async function run(realFn, mockFn) {
  if (API_MODE === 'mock') return mockFn();
  if (API_MODE === 'auto') {
    try {
      return await realFn();
    } catch (error) {
      if (!error.response) return mockFn(); // servidor fora do ar -> mock
      throw error;
    }
  }
  return realFn();
}

export function login({ usuario, senha }) {
  return run(
    async () => {
      const { data } = await http.post('/auth/login', { usuario, senha });
      return data;
    },
    () => mockLogin({ usuario, senha }),
  );
}

export function getProducts() {
  return run(
    async () => {
      const { data } = await http.get('/produtos');
      return (Array.isArray(data) ? data : data.produtos ?? []).map(normalizeProduct);
    },
    mockGetProducts,
  );
}

export function createProduct(product) {
  return run(
    async () => {
      const body = new FormData();
      ['nome', 'descricao', 'categoria', 'gramatura', 'preco'].forEach((key) =>
        body.append(key, product[key]),
      );
      if (product.imagem) body.append('imagem', product.imagem);
      const { data } = await http.post('/produtos', body);
      return normalizeProduct(data);
    },
    () => mockCreateProduct(product),
  );
}

export function deleteProduct(id) {
  return run(
    async () => {
      await http.delete(`/produtos/${encodeURIComponent(id)}`);
    },
    () => mockDeleteProduct(id),
  );
}
