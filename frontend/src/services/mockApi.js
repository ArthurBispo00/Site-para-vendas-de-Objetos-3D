import { MOCK_DELAY_MS } from '../appConfig';
import { fileToResizedDataUrl, makePlaceholder } from '../utils/image';
import { MOCK_CREDENTIALS, seedProducts } from './mockData';

// "Back-end" falso: guarda tudo no LocalStorage e imita o contrato REST.
const STORAGE_KEY = 'jaca3d:produtos';

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

function readAll() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* JSON corrompido ou storage indisponível: recomeça do seed */
  }
  const seed = seedProducts();
  writeAll(seed);
  return seed;
}

function writeAll(list) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    throw Object.assign(new Error('storage'), {
      userMessage: 'Sem espaço no navegador para salvar. Tente uma imagem menor.',
    });
  }
}

export async function mockLogin({ usuario, senha }) {
  await wait();
  if (usuario === MOCK_CREDENTIALS.usuario && senha === MOCK_CREDENTIALS.senha) {
    return { token: 'mock-token', usuario };
  }
  throw Object.assign(new Error('invalid-credentials'), {
    userMessage: 'Usuário ou senha inválidos.',
  });
}

export async function mockGetProducts() {
  await wait();
  return readAll();
}

export async function mockCreateProduct({ nome, descricao, categoria, gramatura, preco, imagem }) {
  await wait();
  const imagemUrl = imagem ? await fileToResizedDataUrl(imagem) : makePlaceholder(nome);
  const created = {
    id: `m${Date.now()}${Math.floor(Math.random() * 1000)}`,
    nome: nome.trim(),
    descricao: descricao.trim(),
    categoria,
    gramatura,
    preco,
    imagemUrl,
  };
  writeAll([created, ...readAll()]);
  return created;
}

export async function mockDeleteProduct(id) {
  await wait();
  writeAll(readAll().filter((p) => p.id !== id));
}
