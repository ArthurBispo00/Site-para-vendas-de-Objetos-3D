
from fastapi.testclient import TestClient

from app.main import app


def test_health_check():
    with TestClient(app) as client:
        resposta = client.get("/health")

    assert resposta.status_code == 200
    assert resposta.json() == {
        "status": "ok",
        "message": "API Jaca 3D funcionando",
    }
