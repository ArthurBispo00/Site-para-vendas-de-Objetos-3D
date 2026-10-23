import { FILTER_ALL } from './constants';

/** minúsculas e sem acentos: "Dragão" -> "dragao" */
export function normalizeText(text = '') {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Filtra por texto (nome ou descrição) e por categoria.
 * @param {Array} products
 * @param {{query?: string, category?: string}} filters
 */
export function filterProducts(products, { query = '', category = FILTER_ALL } = {}) {
  const q = normalizeText(query);
  return products.filter((p) => {
    const matchesCategory = category === FILTER_ALL || p.categoria === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    return normalizeText(p.nome).includes(q) || normalizeText(p.descricao).includes(q);
  });
}
