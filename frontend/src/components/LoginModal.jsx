import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User, X } from 'lucide-react';
import { useRef, useState } from 'react';
import useFocusTrap from '../hooks/useFocusTrap';
import { toUserMessage } from '../services/apiService';
import { validateLogin } from '../utils/validation';
import Logo from './Logo';

export default function LoginModal({ open, onClose, onSubmit }) {
  const dialogRef = useRef(null);
  const userRef = useRef(null);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useFocusTrap(dialogRef, open, onClose, userRef);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    const found = validateLogin({ usuario, senha });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({ usuario: usuario.trim(), senha });
    } catch (err) {
      setSubmitError(toUserMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm ${
      hasError ? 'border-red-600' : 'border-ink/15'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-titulo"
        aria-describedby="login-descricao"
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-jaca-600 via-gold-400 to-jaca-600" />

        <div className="p-8">
          <div className="flex items-center justify-between">
            <Logo className="h-14 w-14" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar janela de login"
              className="rounded-lg p-2 text-ink/70 hover:bg-ink/5"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <span className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
            <ShieldCheck aria-hidden="true" className="h-6 w-6" />
          </span>
          <h2 id="login-titulo" className="mt-4 text-2xl font-extrabold">
            Acesso administrativo
          </h2>
          <p id="login-descricao" className="mt-1 text-sm text-ink/70">
            Entre com suas credenciais para gerenciar o catálogo.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="login-usuario" className="mb-1.5 block text-sm font-semibold">
                Usuário
              </label>
              <div className="relative">
                <User aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/60" />
                <input
                  id="login-usuario"
                  ref={userRef}
                  type="text"
                  autoComplete="username"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  aria-invalid={Boolean(errors.usuario)}
                  aria-describedby={errors.usuario ? 'login-usuario-erro' : undefined}
                  className={inputClass(errors.usuario)}
                />
              </div>
              {errors.usuario && (
                <p id="login-usuario-erro" className="mt-1 text-sm text-red-700">
                  {errors.usuario}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="login-senha" className="mb-1.5 block text-sm font-semibold">
                Senha
              </label>
              <div className="relative">
                <Lock aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/60" />
                <input
                  id="login-senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  aria-invalid={Boolean(errors.senha)}
                  aria-describedby={errors.senha ? 'login-senha-erro' : undefined}
                  className={inputClass(errors.senha)}
                />
              </div>
              {errors.senha && (
                <p id="login-senha-erro" className="mt-1 text-sm text-red-700">
                  {errors.senha}
                </p>
              )}
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-ink/75 hover:bg-ink/5"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" className="h-4 w-4" />
                  )}
                  {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                </button>
              </div>
            </div>

            <div role="alert" aria-live="assertive">
              {submitError && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                  {submitError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-400 px-4 py-3 text-sm font-bold text-ink shadow transition hover:bg-gold-500 disabled:opacity-60"
            >
              {submitting ? 'Entrando…' : 'Entrar no painel'}
              {!submitting && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-ink/70">Área restrita aos administradores da Jaca 3D</p>
        </div>
      </div>
    </div>
  );
}
