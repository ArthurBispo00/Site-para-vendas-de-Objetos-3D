import { buildWhatsAppLink, buildWhatsAppMessage } from '../utils/whatsapp';

const product = {
  nome: 'Vaso Twist',
  categoria: 'Decoração',
  gramatura: 180,
  preco: 42.9,
};

describe('WhatsApp', () => {
  it('monta a mensagem com nome, peso e preço', () => {
    const message = buildWhatsAppMessage(product);
    expect(message).toContain('Vaso Twist');
    expect(message).toContain('180g');
    expect(message).toMatch(/R\$\s?42,90/);
  });

  it('gera link wa.me com o texto codificado', () => {
    const link = buildWhatsAppLink(product, '+55 (11) 99999-9999');
    expect(link.startsWith('https://wa.me/5511999999999?text=')).toBe(true);
    const text = decodeURIComponent(link.split('?text=')[1]);
    expect(text).toBe(buildWhatsAppMessage(product));
  });
});
