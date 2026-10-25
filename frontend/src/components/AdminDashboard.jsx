import { LogOut, Package, Plus, Store, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toUserMessage } from "../services/apiService";
import { CATEGORIES } from "../utils/constants";
import { formatPrice, formatWeight } from "../utils/formatters";
import {
  parseDecimal,
  parseWeight,
  validateImage,
  validateProduct,
} from "../utils/validation";
import Logo from "./Logo";

const EMPTY_FORM = {
  nome: "",
  descricao: "",
  categoria: "",
  gramatura: "",
  preco: "",
};

export default function AdminDashboard({
  products,
  onCreate,
  onEdit,
  onDelete,
  onLogout,
  onBackToStore,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null); // produto aguardando confirmação de exclusão
  const fileRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [imagemUrlAtual, setImagemUrlAtual] = useState(null);

  // libera a URL temporária da pré-visualização
  useEffect(() => {
    if (!imagem || typeof URL.createObjectURL !== "function") {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(imagem);
    setPreview(url);
    return () => URL.revokeObjectURL?.(url);
  }, [imagem]);

  const setField = (name) => (event) =>
    setForm((prev) => ({ ...prev, [name]: event.target.value }));

  const handleEdit = (product) => {
    setEditingId(product.id);
    setImagemUrlAtual(product.imagemUrl ?? product.imagem_url ?? null);

    setForm({
      nome: product.nome ?? "",
      descricao: product.descricao ?? "",
      categoria: product.categoria ?? "",
      gramatura: String(product.gramatura ?? ""),
      preco: String(product.preco ?? "").replace(".", ","),
    });

    setImagem(null);
    setErrors({});
    setStatus({ type: "", message: "" });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setImagemUrlAtual(null);
    setForm(EMPTY_FORM);
    setImagem(null);
    setErrors({});
    setStatus({ type: "", message: "" });

    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0] ?? null;
    const imageError = validateImage(file);
    setErrors((prev) => ({ ...prev, imagem: imageError ?? undefined }));
    setImagem(imageError ? null : file);
    if (imageError) event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    const found = validateProduct({ ...form, imagem });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // leva o foco ao primeiro campo com erro
      const first = Object.keys(found)[0];
      document.getElementById(`campo-${first}`)?.focus();
      return;
    }

    setSaving(true);
    try {
      const productData = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        categoria: form.categoria,
        gramatura: parseWeight(form.gramatura),
        preco: parseDecimal(form.preco),
        imagem,
        imagem_url: imagemUrlAtual,
      };

      if (editingId !== null) {
        await onEdit(editingId, productData);
      } else {
        await onCreate(productData);
      }
      setForm(EMPTY_FORM);
      setImagem(null);
      setEditingId(null);
      setImagemUrlAtual(null);
      if (fileRef.current) fileRef.current.value = "";
      setStatus({
        type: "success",
        message:
          editingId !== null
            ? "Produto atualizado com sucesso."
            : "Produto adicionado à vitrine.",
      });
    } catch (err) {
      setStatus({ type: "error", message: toUserMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    setConfirmId(null);
    try {
      await onDelete(product.id);
      setStatus({
        type: "success",
        message: `"${product.nome}" foi removido.`,
      });
    } catch (err) {
      setStatus({ type: "error", message: toUserMessage(err) });
    }
  };

  const fieldClass = (name) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm placeholder:text-ink/55 ${
      errors[name] ? "border-red-600" : "border-ink/15"
    }`;

  const ErrorText = ({ name }) =>
    errors[name] ? (
      <p id={`erro-${name}`} className="mt-1 text-sm text-red-700">
        {errors[name]}
      </p>
    ) : null;

  const describe = (name) => (errors[name] ? `erro-${name}` : undefined);

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-16 shrink-0 flex-col items-center justify-between bg-ink py-4">
        <div className="flex flex-col items-center gap-6">
          <Logo variant="icon" className="h-11 w-11" />
          <span
            aria-label="Produtos (seção atual)"
            role="img"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-jaca-800 text-gold-400"
          >
            <Package aria-hidden="true" className="h-5 w-5" />
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Sair do painel"
          title="Sair do painel"
          className="rounded-xl p-2 text-white/80 hover:bg-white/10 hover:text-white"
        >
          <LogOut aria-hidden="true" className="h-5 w-5" />
        </button>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 pb-6">
          <h1 className="text-2xl font-extrabold">Painel administrativo</h1>
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-white px-4 py-2 text-sm font-medium hover:bg-gold-100"
          >
            <Store aria-hidden="true" className="h-4 w-4" />
            Ver vitrine
          </button>
        </div>

        <div role="status" aria-live="polite" className="mx-auto max-w-6xl">
          {status.message && (
            <p
              className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
                status.type === "error"
                  ? "bg-red-50 text-red-800"
                  : "bg-jaca-50 text-jaca-800"
              }`}
            >
              {status.message}
            </p>
          )}
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ---------- Novo produto ---------- */}
          <section
            aria-labelledby="novo-titulo"
            className="min-w-0 rounded-2xl bg-white p-6 shadow-card"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                <Plus aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 id="novo-titulo" className="font-bold">
                  Novo produto
                </h2>
                <p className="text-sm text-ink/70">
                  Preencha os dados para publicar na vitrine.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
              <div>
                <span
                  id="foto-rotulo"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Foto do produto
                </span>
                <label
                  htmlFor="campo-imagem"
                  className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-ink/20 bg-ink/[0.03] p-6 text-center focus-within:ring-2 focus-within:ring-jaca-600 focus-within:ring-offset-2 hover:border-jaca-600"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Pré-visualização da foto selecionada"
                      className="h-32 w-32 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-jaca-600 shadow-sm">
                      <Upload aria-hidden="true" className="h-5 w-5" />
                    </span>
                  )}
                  <span className="mt-2 text-sm font-semibold">
                    {imagem ? imagem.name : "Selecionar uma imagem"}
                  </span>
                  <span className="text-xs text-ink/70">
                    JPG, PNG ou WebP • máximo de 5 MB
                  </span>
                  <input
                    id="campo-imagem"
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFile}
                    aria-describedby={describe("imagem")}
                    aria-invalid={Boolean(errors.imagem)}
                    className="sr-only"
                  />
                </label>
                <ErrorText name="imagem" />
              </div>

              <div>
                <label
                  htmlFor="campo-nome"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Nome do objeto
                </label>
                <input
                  id="campo-nome"
                  type="text"
                  value={form.nome}
                  onChange={setField("nome")}
                  placeholder="Ex: Vaso geométrico"
                  aria-invalid={Boolean(errors.nome)}
                  aria-describedby={describe("nome")}
                  className={fieldClass("nome")}
                />
                <ErrorText name="nome" />
              </div>

              <div>
                <label
                  htmlFor="campo-categoria"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Categoria
                </label>
                <select
                  id="campo-categoria"
                  value={form.categoria}
                  onChange={setField("categoria")}
                  aria-invalid={Boolean(errors.categoria)}
                  aria-describedby={describe("categoria")}
                  className={fieldClass("categoria")}
                >
                  <option value="">Selecione…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ErrorText name="categoria" />
              </div>

              <div>
                <label
                  htmlFor="campo-descricao"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Descrição
                </label>
                <textarea
                  id="campo-descricao"
                  rows={4}
                  value={form.descricao}
                  onChange={setField("descricao")}
                  placeholder="Conte os detalhes e diferenciais da peça..."
                  aria-invalid={Boolean(errors.descricao)}
                  aria-describedby={describe("descricao")}
                  className={fieldClass("descricao")}
                />
                <ErrorText name="descricao" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="campo-gramatura"
                    className="mb-1.5 block text-sm font-semibold"
                  >
                    Gramatura
                  </label>
                  <input
                    id="campo-gramatura"
                    type="text"
                    inputMode="numeric"
                    value={form.gramatura}
                    onChange={setField("gramatura")}
                    placeholder="Ex: 150g"
                    aria-invalid={Boolean(errors.gramatura)}
                    aria-describedby={describe("gramatura")}
                    className={fieldClass("gramatura")}
                  />
                  <ErrorText name="gramatura" />
                </div>
                <div>
                  <label
                    htmlFor="campo-preco"
                    className="mb-1.5 block text-sm font-semibold"
                  >
                    Preço
                  </label>
                  <input
                    id="campo-preco"
                    type="text"
                    inputMode="decimal"
                    value={form.preco}
                    onChange={setField("preco")}
                    placeholder="Ex: 49,90"
                    aria-invalid={Boolean(errors.preco)}
                    aria-describedby={describe("preco")}
                    className={fieldClass("preco")}
                  />
                  <ErrorText name="preco" />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-jaca-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-jaca-700 disabled:opacity-60"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
                {saving
                  ? "Salvando…"
                  : editingId !== null
                    ? "Salvar alterações"
                    : "Adicionar produto"}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm font-semibold hover:bg-ink/5"
                >
                  Cancelar edição
                </button>
              )}
            </form>
          </section>

          {/* ---------- Produtos publicados ---------- */}
          <section
            aria-labelledby="publicados-titulo"
            className="h-fit min-w-0 rounded-2xl bg-white p-6 shadow-card"
          >
            <div className="flex items-start justify-between gap-3 border-b border-ink/10 pb-4">
              <div>
                <h2 id="publicados-titulo" className="font-bold">
                  Produtos publicados
                </h2>
                <p className="text-sm text-ink/70">
                  Itens que aparecem na página inicial.
                </p>
              </div>
              <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold">
                {products.length} {products.length === 1 ? "item" : "itens"}
              </span>
            </div>

            {products.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink/70">
                Nenhum produto publicado ainda.
              </p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {products.map((product) => (
                  <li key={product.id} className="flex items-center gap-4 py-4">
                    <img
                      src={product.imagemUrl}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{product.nome}</p>
                      <p className="text-sm text-ink/75">
                        {formatWeight(product.gramatura)}{" "}
                        <span aria-hidden="true">•</span>{" "}
                        <span className="font-bold text-jaca-700">
                          {formatPrice(product.preco)}
                        </span>
                      </p>
                    </div>
                    {confirmId === product.id ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          autoFocus
                          onClick={() => handleDelete(product)}
                          aria-label={`Confirmar exclusão de ${product.nome}`}
                          className="rounded-xl bg-red-700 px-3 py-2 text-xs font-semibold text-white hover:bg-red-800"
                        >
                          Excluir
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          aria-label={`Cancelar exclusão de ${product.nome}`}
                          className="rounded-xl border border-ink/15 px-3 py-2 text-xs font-semibold hover:bg-ink/5"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          aria-label={`Editar ${product.nome}`}
                          className="rounded-xl border border-ink/15 px-3 py-2 text-xs font-semibold transition hover:bg-ink/5"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(product.id)}
                          aria-label={`Excluir ${product.nome}`}
                          className="rounded-xl bg-red-50 p-2.5 text-red-700 transition hover:bg-red-100"
                        >
                          <Trash2 aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
