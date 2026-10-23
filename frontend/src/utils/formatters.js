const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** 42.9 -> "R$ 42,90" */
export function formatPrice(value) {
  return brl.format(Number(value) || 0);
}

/** 180 -> "180g" */
export function formatWeight(grams) {
  return `${Number(grams) || 0}g`;
}
