import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginModal from '../components/LoginModal';

describe('<LoginModal />', () => {
  it('não renderiza nada quando fechado', () => {
    render(<LoginModal open={false} onClose={() => {}} onSubmit={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('abre como diálogo acessível e foca o campo de usuário', () => {
    render(<LoginModal open onClose={() => {}} onSubmit={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: /acesso administrativo/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByLabelText('Usuário')).toHaveFocus();
  });

  it('valida campos vazios e não envia', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    render(<LoginModal open onClose={() => {}} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /entrar no painel/i }));

    expect(screen.getByText('Informe o usuário.')).toBeInTheDocument();
    expect(screen.getByText('Informe a senha.')).toBeInTheDocument();
    expect(screen.getByLabelText('Usuário')).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('alterna a visibilidade da senha', async () => {
    const user = userEvent.setup();
    render(<LoginModal open onClose={() => {}} onSubmit={() => {}} />);
    const senha = screen.getByLabelText('Senha');
    expect(senha).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /mostrar senha/i }));
    expect(senha).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /ocultar senha/i })).toBeInTheDocument();
  });

  it('envia as credenciais preenchidas', async () => {
    const onSubmit = jest.fn().mockResolvedValue();
    const user = userEvent.setup();
    render(<LoginModal open onClose={() => {}} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Usuário'), 'admin');
    await user.type(screen.getByLabelText('Senha'), 'admin');
    await user.click(screen.getByRole('button', { name: /entrar no painel/i }));

    expect(onSubmit).toHaveBeenCalledWith({ usuario: 'admin', senha: 'admin' });
  });

  it('mostra a mensagem de erro quando o login falha', async () => {
    const onSubmit = jest.fn().mockRejectedValue({ userMessage: 'Usuário ou senha inválidos.' });
    const user = userEvent.setup();
    render(<LoginModal open onClose={() => {}} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Usuário'), 'x');
    await user.type(screen.getByLabelText('Senha'), 'y');
    await user.click(screen.getByRole('button', { name: /entrar no painel/i }));

    expect(await screen.findByText('Usuário ou senha inválidos.')).toBeInTheDocument();
  });

  it('fecha com a tecla Esc', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<LoginModal open onClose={onClose} onSubmit={() => {}} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('mantém o foco preso dentro do modal ao usar Tab', async () => {
    const user = userEvent.setup();
    render(<LoginModal open onClose={() => {}} onSubmit={() => {}} />);
    const dialog = screen.getByRole('dialog');

    for (let i = 0; i < 12; i += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement);
    }
  });
});
