INQUIRY_PAYLOAD = {
    "name": "Jane Buyer",
    "phone": "9800000000",
    "email": "jane@example.com",
    "message": "Interested in a piglet.",
    "interest": "Yorkshire cross piglet",
}


def test_create_inquiry_public(client):
    response = client.post("/api/inquiries/", json=INQUIRY_PAYLOAD)
    assert response.status_code == 201
    assert response.json()["status"] == "new"


def test_inquiry_list_requires_auth(client):
    response = client.get("/api/inquiries/")
    assert response.status_code == 401


def test_inquiry_rate_limit(client):
    statuses = []
    for _ in range(6):
        response = client.post("/api/inquiries/", json=INQUIRY_PAYLOAD)
        statuses.append(response.status_code)
    assert 429 in statuses


def test_inquiry_status_update(admin_client):
    create_response = admin_client.post("/api/inquiries/", json=INQUIRY_PAYLOAD)
    inquiry_id = create_response.json()["id"]

    patch_response = admin_client.patch(
        f"/api/inquiries/{inquiry_id}", json={"status": "contacted"}
    )
    assert patch_response.status_code == 200
    assert patch_response.json()["status"] == "contacted"
