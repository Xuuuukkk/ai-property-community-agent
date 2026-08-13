"""Tests for the authentication endpoints."""

from app.core.security import get_password_hash, verify_password
from app.models.user import User


class TestAuthFlow:
    """End-to-end login and token validation tests."""

    def test_password_hash_roundtrip(self) -> None:
        hashed = get_password_hash("demo-password")
        assert verify_password("demo-password", hashed)
        assert not verify_password("wrong-password", hashed)

    def test_login_with_seed_password(self, client) -> None:
        # After seed import, demo passwords are set to "123456".
        response = client.post("/api/auth/login", json={
            "username": "guoyi378",
            "password": "123456",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["user"]["role"] == "OWNER"

    def test_login_with_set_password(self, client, db) -> None:
        user = db.query(User).filter(User.username == "guoyi378").first()
        assert user
        user.password_hash = get_password_hash("123456")
        db.commit()

        response = client.post("/api/auth/login", json={
            "username": "guoyi378",
            "password": "123456",
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["role"] == "OWNER"

        # /me should return the user with the token.
        headers = {"Authorization": f"Bearer {data['access_token']}"}
        me_response = client.get("/api/auth/me", headers=headers)
        assert me_response.status_code == 200
        assert me_response.json()["username"] == "guoyi378"

    def test_me_without_token(self, client) -> None:
        response = client.get("/api/auth/me")
        assert response.status_code == 401

    def test_login_wrong_password(self, client, db) -> None:
        user = db.query(User).filter(User.username == "guoyi378").first()
        user.password_hash = get_password_hash("123456")
        db.commit()

        response = client.post("/api/auth/login", json={
            "username": "guoyi378",
            "password": "wrong",
        })
        assert response.status_code == 401
