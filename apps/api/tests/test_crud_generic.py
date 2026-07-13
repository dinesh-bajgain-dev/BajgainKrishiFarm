PIG_PAYLOAD = {
    "name_en": "Yorkshire cross piglet",
    "name_ne": "योर्कशायर क्रस पाठो",
    "listing_type": "piglet",
    "breed_en": "Yorkshire cross",
    "breed_ne": "योर्कशायर क्रस",
    "gender": "male",
    "date_of_birth": "2026-05-15",
    "price": 8000,
    "status": "available",
    "description_en": "Healthy piglet",
    "image_urls": ["/uploads/example.jpg"],
}

ALBUM_PAYLOAD = {"title_en": "Our Pigs", "title_ne": "हाम्रा सुँगुरहरू"}


def test_pig_list_is_public(client):
    response = client.get("/api/pigs/")
    assert response.status_code == 200
    assert response.json() == []


def test_pig_create_requires_auth(client):
    response = client.post("/api/pigs/", json=PIG_PAYLOAD)
    assert response.status_code == 401


def test_pig_full_crud_cycle(admin_client):
    create_response = admin_client.post("/api/pigs/", json=PIG_PAYLOAD)
    assert create_response.status_code == 201
    pig_id = create_response.json()["id"]
    assert create_response.json()["image_urls"] == ["/uploads/example.jpg"]

    list_response = admin_client.get("/api/pigs/")
    assert len(list_response.json()) == 1

    get_response = admin_client.get(f"/api/pigs/{pig_id}")
    assert get_response.status_code == 200
    assert get_response.json()["name_en"] == "Yorkshire cross piglet"

    update_response = admin_client.put(
        f"/api/pigs/{pig_id}", json={"name_en": "Updated Name", "status": "sold"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["name_en"] == "Updated Name"
    assert update_response.json()["status"] == "sold"

    delete_response = admin_client.delete(f"/api/pigs/{pig_id}")
    assert delete_response.status_code == 204

    get_after_delete = admin_client.get(f"/api/pigs/{pig_id}")
    assert get_after_delete.status_code == 404


def test_pig_filter_by_listing_type(admin_client):
    admin_client.post("/api/pigs/", json=PIG_PAYLOAD)
    admin_client.post(
        "/api/pigs/",
        json={**PIG_PAYLOAD, "name_en": "Duroc boar", "listing_type": "breeding"},
    )

    filtered = admin_client.get("/api/pigs/", params={"listing_type": "piglet"})
    assert filtered.status_code == 200
    assert len(filtered.json()) == 1
    assert filtered.json()[0]["listing_type"] == "piglet"

    unfiltered = admin_client.get("/api/pigs/")
    assert len(unfiltered.json()) == 2


def test_gallery_filter_by_album(admin_client):
    album_id = admin_client.post("/api/albums/", json=ALBUM_PAYLOAD).json()["id"]
    other_album_id = admin_client.post(
        "/api/albums/", json={**ALBUM_PAYLOAD, "title_en": "Around the Farm"}
    ).json()["id"]

    admin_client.post(
        "/api/gallery/", json={"album_id": album_id, "image_url": "/uploads/a.jpg"}
    )
    admin_client.post(
        "/api/gallery/", json={"album_id": other_album_id, "image_url": "/uploads/b.jpg"}
    )

    filtered = admin_client.get("/api/gallery/", params={"album_id": album_id})
    assert filtered.status_code == 200
    assert len(filtered.json()) == 1
    assert filtered.json()[0]["album_id"] == album_id


def test_singleton_pages_return_404_when_unseeded(client):
    for path in ("/api/farm-info/", "/api/home-page/", "/api/about-page/"):
        response = client.get(path)
        assert response.status_code == 404


def test_singleton_update_requires_auth(client):
    response = client.put("/api/home-page/", json={"hero_title_en": "New title"})
    assert response.status_code == 401
