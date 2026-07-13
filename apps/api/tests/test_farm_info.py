from app.models.farm_info import FarmInfo


VALID_GOOGLE_MAPS_EMBED = (
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345!2d-1.2345!3d2.3456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDU4JzM4LjAiTiAxLjIzNDUnNTguMCJ9" '
    'width="600" height="450" style="border:0;" allowfullscreen="" '
    'loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
)


def test_farm_info_accepts_valid_google_maps_embed_code(admin_client, db):
    db.add(
        FarmInfo(
            farm_name_en="Bajgain Krishi Farm",
            description_en="Healthy piglets and breeding pigs.",
            phone="+977 9800000000",
            email="hello@bajgainfarm.com",
            address_en="Bajgain Tole, Pokhara, Kaski, Nepal",
            hours_en="Sunday - Friday: 8:00 AM - 5:00 PM",
            latitude=28.2096,
            longitude=83.9856,
        )
    )
    db.commit()

    response = admin_client.put(
        "/api/farm-info/",
        json={"google_maps_embed_code": VALID_GOOGLE_MAPS_EMBED},
    )

    assert response.status_code == 200
    assert response.json()["google_maps_embed_code"] == VALID_GOOGLE_MAPS_EMBED


def test_farm_info_rejects_non_google_maps_embed_code(admin_client, db):
    db.add(
        FarmInfo(
            farm_name_en="Bajgain Krishi Farm",
            description_en="Healthy piglets and breeding pigs.",
            phone="+977 9800000000",
            email="hello@bajgainfarm.com",
            address_en="Bajgain Tole, Pokhara, Kaski, Nepal",
            hours_en="Sunday - Friday: 8:00 AM - 5:00 PM",
            latitude=28.2096,
            longitude=83.9856,
        )
    )
    db.commit()

    response = admin_client.put(
        "/api/farm-info/",
        json={"google_maps_embed_code": "<iframe src='https://example.com'></iframe>"},
    )

    assert response.status_code == 422
