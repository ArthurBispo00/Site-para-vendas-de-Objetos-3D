import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminDashboard from "../components/AdminDashboard";

const products = [
  {
    id: "1",
    nome: "Vaso Twist",
    descricao: "x",
    categoria: "Decoração",
    gramatura: 180,
    preco: 42.9,
    imagemUrl: "a.png",
  },
  {
    id: "2",
    nome: "Dragão Articulado",
    descricao: "x",
    categoria: "Colecionáveis",
    gramatura: 95,
    preco: 34.9,
    imagemUrl: "b.png",
  },
];

const setup = (props = {}) => {
  const handlers = {
    onCreate: jest.fn().mockResolvedValue({}),
    onDelete: jest.fn().mockResolvedValue(),
    onLogout: jest.fn(),
    onBackToStore: jest.fn(),
  };
  render(<AdminDashboard products={products} {...handlers} {...props} />);
  return handlers;
};

describe("<AdminDashboard />", () => {
  it("lista os produtos publicados com peso e preço", () => {
    setup();
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("2 itens")).toBeInTheDocument();
    expect(screen.getByText(/180g/)).toBeInTheDocument();
  });

  it("valida os campos obrigatórios e não chama a API", async () => {
    const user = userEvent.setup();
    const { onCreate } = setup();

    await user.click(
      screen.getByRole("button", { name: /adicionar produto/i }),
    );

    expect(screen.getByText(/informe o nome do objeto/i)).toBeInTheDocument();
    expect(screen.getByText(/descreva a peça/i)).toBeInTheDocument();
    expect(screen.getByText(/escolha uma categoria/i)).toBeInTheDocument();
    expect(screen.getByText(/informe a gramatura/i)).toBeInTheDocument();
    expect(screen.getByText(/informe um preço válido/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Nome do objeto")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Nome do objeto")).toHaveFocus();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("envia o produto com números convertidos e limpa o formulário", async () => {
    const user = userEvent.setup();
    const { onCreate } = setup();

    await user.type(screen.getByLabelText("Nome do objeto"), "Vaso geométrico");
    await user.selectOptions(screen.getByLabelText("Categoria"), "Decoração");
    await user.type(
      screen.getByLabelText("Descrição"),
      "Vaso decorativo com acabamento fosco.",
    );
    await user.type(screen.getByLabelText("Gramatura"), "150g");
    await user.type(screen.getByLabelText("Preço"), "49,90");
    await user.click(
      screen.getByRole("button", { name: /adicionar produto/i }),
    );

    expect(onCreate).toHaveBeenCalledWith({
      nome: "Vaso geométrico",
      descricao: "Vaso decorativo com acabamento fosco.",
      categoria: "Decoração",
      gramatura: 150,
      preco: 49.9,
      imagem: null,
      imagem_url: null,
    });

    expect(
      await screen.findByText(/produto adicionado à vitrine/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nome do objeto")).toHaveValue("");
  });

  it("exclui um produto após confirmar na própria tela", async () => {
    const user = userEvent.setup();
    const { onDelete } = setup();

    await user.click(
      screen.getByRole("button", { name: "Excluir Vaso Twist" }),
    );
    expect(onDelete).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole("button", { name: "Confirmar exclusão de Vaso Twist" }),
    );

    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("não exclui se o usuário cancelar a confirmação", async () => {
    const user = userEvent.setup();
    const { onDelete } = setup();

    await user.click(
      screen.getByRole("button", { name: "Excluir Vaso Twist" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Cancelar exclusão de Vaso Twist" }),
    );

    expect(onDelete).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Excluir Vaso Twist" }),
    ).toBeInTheDocument();
  });

  it("dispara sair do painel", async () => {
    const user = userEvent.setup();
    const { onLogout } = setup();
    await user.click(screen.getByRole("button", { name: /sair do painel/i }));
    expect(onLogout).toHaveBeenCalled();
  });
});
