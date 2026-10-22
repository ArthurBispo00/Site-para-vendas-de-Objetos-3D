const KEY = 'jaca3d:token';

// sessionStorage: o login some ao fechar a aba.
export const tokenStorage = {
  get() {
    try {
      return window.sessionStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      window.sessionStorage.setItem(KEY, token);
    } catch {
      /* armazenamento indisponível: segue sem persistir */
    }
  },
  clear() {
    try {
      window.sessionStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
  },
};
