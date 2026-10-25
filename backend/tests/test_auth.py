
def test_login_sucesso(client):
    resposta = client.post(
        "/auth/login",
        data={
            "username": "admin",
            "password": "admin",
        },
    )

    assert resposta.status_code == 200

    dados = resposta.json()
    assert "access_token" in dados
    assert dados["token_type"] == "bearer"


def test_login_senha_incorreta(client):
    resposta = client.post(
        "/auth/login",
        data={
            "username": "admin",
            "password": "senha_errada",
        },
    )

    assert resposta.status_code == 401


def test_login_usuario_inexistente(client):
    resposta = client.post(
        "/auth/login",
        data={
            "username": "usuario_inexistente",
            "password": "admin",
        },
    )

    assert resposta.status_code == 401
