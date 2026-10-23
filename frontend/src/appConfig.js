// Única porta de entrada para variáveis de ambiente (Vite).
// Nos testes (Jest) este arquivo é substituído por src/__mocks__/appConfig.js.

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

/** 'mock' | 'api' | 'auto' — veja .env.example */
export const API_MODE = import.meta.env.VITE_API_MODE || 'mock';

/** Número do WhatsApp da loja: DDI + DDD + número, só dígitos. */
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999';

/** Latência simulada do mock, para a interface mostrar estados de carregamento. */
export const MOCK_DELAY_MS = 300;
