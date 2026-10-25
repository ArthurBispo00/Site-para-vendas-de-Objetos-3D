
def obter_token(client):
    resposta = client.post(
        "/auth/login",
        data={
            "username": "admin",
            "password": "admin",
        },
    )
    assert resposta.status_code == 200
    return resposta.json()["access_token"]


def dados_produto():
    return {
        "nome": "Suporte de celular",
        "descricao": "Suporte impresso em 3D para celular",
        "categoria": "Acessórios",
        "gramatura": "50g",
        "preco": 29.90,
        "imagem_url": "https://exemplo.com/suporte.jpg",
    }


def test_listar_produtos_publicamente(client):
    resposta = client.get("/produtos")
    assert resposta.status_code == 200
    assert resposta.json() == []


def test_cadastrar_sem_token(client):
    resposta = client.post(
        "/produtos",
        json=dados_produto(),
    )
    assert resposta.status_code == 401


def test_cadastrar_com_token(client):
    token = obter_token(client)

    resposta = client.post(
        "/produtos",
        json=dados_produto(),
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resposta.status_code == 201
    assert resposta.json()["nome"] == "Suporte de celular"
    assert resposta.json()["ativo"] is True


def test_editar_produto(client):
    token = obter_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    cadastro = client.post(
        "/produtos",
        json=dados_produto(),
        headers=headers,
    )
    produto_id = cadastro.json()["id"]

    dados = dados_produto()
    dados["nome"] = "Suporte de celular atualizado"

    resposta = client.put(
        f"/produtos/{produto_id}",
        json=dados,
        headers=headers,
    )

    assert resposta.status_code == 200
    assert resposta.json()["nome"] == "Suporte de celular atualizado"


def test_desativar_produto(client):
    token = obter_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    cadastro = client.post(
        "/produtos",
        json=dados_produto(),
        headers=headers,
    )
    produto_id = cadastro.json()["id"]

    resposta = client.delete(
        f"/produtos/{produto_id}",
        headers=headers,
    )

    assert resposta.status_code == 204

    listagem = client.get("/produtos")
    ids = [produto["id"] for produto in listagem.json()]
    assert produto_id not in ids


def test_editar_produto_inexistente(client):
    token = obter_token(client)

    resposta = client.put(
        "/produtos/99999",
        json=dados_produto(),
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resposta.status_code == 404
