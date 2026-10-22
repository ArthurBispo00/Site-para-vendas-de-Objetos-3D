import { ACCEPTED_IMAGE_TYPES, CATEGORIES, MAX_IMAGE_BYTES } from './constants';

/** "1.234,56" | "49,90" | "R$ 49.90" -> número (NaN se inválido) */
export function parseDecimal(value) {
  if (typeof value === 'number') return value;
  const cleaned = String(value ?? '')
    .trim()
    .replace(/[R$\s]/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '') // separador de milhar
    .replace(',', '.');
  if (cleaned === '') return NaN;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

/** "150g" | "150" -> 150 (NaN se inválido) */
export function parseWeight(value) {
  if (typeof value === 'number') return value;
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits === '' ? NaN : Number(digits);
}

export function validateImage(file) {
  if (!file) return null;
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'Use uma imagem JPG, PNG ou WebP.';
  if (file.size > MAX_IMAGE_BYTES) return 'A imagem deve ter no máximo 5 MB.';
  return null;
}

/**
 * Valida o formulário de novo produto.
 * Retorna um objeto { campo: mensagem }; vazio = válido.
 */
export function validateProduct({ nome, descricao, categoria, gramatura, preco, imagem }) {
  const errors = {};

  if (!String(nome ?? '').trim() || String(nome).trim().length < 3) {
    errors.nome = 'Informe o nome do objeto (mínimo 3 caracteres).';
  }
  if (String(descricao ?? '').trim().length < 10) {
    errors.descricao = 'Descreva a peça (mínimo 10 caracteres).';
  }
  if (!CATEGORIES.includes(categoria)) {
    errors.categoria = 'Escolha uma categoria.';
  }
  const g = parseWeight(gramatura);
  if (!(g > 0)) errors.gramatura = 'Informe a gramatura em gramas (ex: 150).';

  const p = parseDecimal(preco);
  if (!(p > 0)) errors.preco = 'Informe um preço válido (ex: 49,90).';

  const imageError = validateImage(imagem);
  if (imageError) errors.imagem = imageError;

  return errors;
}

/** Valida o formulário de login. */
export function validateLogin({ usuario, senha }) {
  const errors = {};
  if (!String(usuario ?? '').trim()) errors.usuario = 'Informe o usuário.';
  if (!String(senha ?? '')) errors.senha = 'Informe a senha.';
  return errors;
}
