import { WHATSAPP_NUMBER } from '../appConfig';
import { formatPrice, formatWeight } from './formatters';

/** Mensagem pré-formatada do pedido. */
export function buildWhatsAppMessage(product) {
  return (
    `Olá, Jaca 3D! Tenho interesse neste produto:\n\n` +
    `*${product.nome}*\n` +
    `Categoria: ${product.categoria || '-'}\n` +
    `Peso: ${formatWeight(product.gramatura)}\n` +
    `Valor: ${formatPrice(product.preco)}\n\n` +
    `Podemos conversar sobre o pedido?`
  );
}

/** Link da API do WhatsApp: https://wa.me/<numero>?text=<mensagem codificada> */
export function buildWhatsAppLink(product, phone = WHATSAPP_NUMBER) {
  const digits = String(phone).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(buildWhatsAppMessage(product))}`;
}
