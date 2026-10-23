import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

const renderApp = () =>
  render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );

describe('<App /> – fluxo completo (mock)', () => {
  it('carrega a vitrine com os produtos', async () => {
    renderApp();
    expect(await screen.findByRole('heading', { name: 'Vaso Twist' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ideias que ganham forma.');
  });

  it('faz login, adiciona e exclui um produto no painel', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole('heading', { name: 'Vaso Twist' });

    await user.click(screen.getByRole('button', { name: /login admin/i }));
    await user.type(screen.getByLabelText('Usuário'), 'admin');
    await user.type(screen.getByLabelText('Senha'), 'admin');
    await user.click(screen.getByRole('button', { name: /entrar no painel/i }));

    expect(await screen.findByRole('heading', { name: /painel administrativo/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Nome do objeto'), 'Chaveiro 3D');
    await user.selectOptions(screen.getByLabelText('Categoria'), 'Presentes');
    await user.type(screen.getByLabelText('Descrição'), 'Chaveiro personalizado com nome.');
    await user.type(screen.getByLabelText('Gramatura'), '12');
    await user.type(screen.getByLabelText('Preço'), '15,00');
    await user.click(screen.getByRole('button', { name: /adicionar produto/i }));
    expect(await screen.findByText('Chaveiro 3D')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Excluir Chaveiro 3D' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar exclusão de Chaveiro 3D' }));
    expect(await screen.findByText(/foi removido/i)).toBeInTheDocument();
    expect(screen.queryByText('Chaveiro 3D', { selector: 'p' })).not.toBeInTheDocument();
  });

  it('mostra erro com credenciais erradas', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole('heading', { name: 'Vaso Twist' });

    await user.click(screen.getByRole('button', { name: /login admin/i }));
    await user.type(screen.getByLabelText('Usuário'), 'admin');
    await user.type(screen.getByLabelText('Senha'), 'errada');
    await user.click(screen.getByRole('button', { name: /entrar no painel/i }));

    expect(await screen.findByText('Usuário ou senha inválidos.')).toBeInTheDocument();
  });
});
