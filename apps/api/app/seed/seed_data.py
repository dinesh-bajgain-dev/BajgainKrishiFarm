"""Idempotent seed script: populates placeholder content for local development.

Run with: python -m app.seed.seed_data
Placeholder images live in apps/web/public/placeholders/ and are referenced
here as absolute paths (e.g. /placeholders/hero-farm.jpg) so the Next.js app
serves them directly from its own public folder.

All seeded text is intentionally modest and honest: this is a small startup
family farm that only sells piglets and breeding pigs. Contact details are
placeholders the owner replaces through the admin panel.
"""

from datetime import date, timedelta

from app.core.config import settings
from app.core.security import hash_password
from app.db.base import Base  # noqa: F401  (ensures models are registered)
from app.db.session import SessionLocal, engine
from app.models.admin_user import AdminUser
from app.models.album import Album
from app.models.farm_info import FarmInfo
from app.models.gallery_image import GalleryImage
from app.models.highlight import Highlight
from app.models.inquiry import Inquiry  # noqa: F401
from app.models.page_content import AboutPage, HomePage, PageBanners
from app.models.pig import ListingType, Pig, PigGender, PigStatus


def seed_admin_user(db) -> None:
    if db.query(AdminUser).filter(AdminUser.email == settings.admin_email).first():
        return
    db.add(
        AdminUser(
            email=settings.admin_email,
            hashed_password=hash_password(settings.admin_password),
        )
    )
    db.commit()


def seed_farm_info(db) -> None:
    if db.query(FarmInfo).first():
        return
    db.add(
        FarmInfo(
            farm_name_en="Bajgain Krishi Farm",
            farm_name_ne="बजगाईं कृषि फार्म",
            description_en=(
                "We are a small family-run pig farm. We raise healthy piglets and "
                "breeding pigs (boars and sows) and sell them directly to local farmers."
            ),
            description_ne=(
                "हामी एउटा सानो पारिवारिक सुँगुर फार्म हौं। हामी स्वस्थ पाठापाठी र "
                "प्रजननका लागि सुँगुरहरू (भाले र माउ) हुर्काएर स्थानीय किसानहरूलाई "
                "सिधै बिक्री गर्छौं।"
            ),
            phone="+977 9800000000",
            whatsapp="+977 9800000000",
            email="hello@bajgainfarm.com",
            address_en="Bajgain Tole, Pokhara, Kaski, Nepal",
            address_ne="बजगाईं टोल, पोखरा, कास्की, नेपाल",
            hours_en="Sunday - Friday: 8:00 AM - 5:00 PM\nSaturday: Closed",
            hours_ne="आइतबार - शुक्रबार: बिहान ८ बजे - बेलुका ५ बजे\nशनिबार: बन्द",
            latitude=28.2096,
            longitude=83.9856,
            google_maps_embed_code=(
                '<iframe src="https://www.google.com/maps?q=28.2096,83.9856(Bajgain%20Krishi%20Farm)' 
                '&z=14&output=embed" width="600" height="450" style="border:0;" '
                'allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
            ),
            facebook_url=None,
            instagram_url=None,
            youtube_url=None,
            tiktok_url=None,
            established_year=2023,
        )
    )
    db.commit()


def seed_home_page(db) -> None:
    if db.query(HomePage).first():
        return
    db.add(
        HomePage(
            hero_title_en="Healthy piglets and breeding pigs from our family farm",
            hero_title_ne="हाम्रो पारिवारिक फार्मबाट स्वस्थ पाठापाठी र प्रजनन सुँगुरहरू",
            hero_subtitle_en=(
                "We are a small pig farm raising a limited number of pigs with daily, "
                "hands-on care. Visit us, meet the animals, and choose the right pig "
                "for your farm."
            ),
            hero_subtitle_ne=(
                "हामी थोरै संख्यामा सुँगुरहरूलाई दैनिक हेरचाहका साथ हुर्काउने सानो फार्म "
                "हौं। फार्ममा आउनुहोस्, जनावरहरू हेर्नुहोस्, र आफ्नो फार्मका लागि उपयुक्त "
                "सुँगुर छान्नुहोस्।"
            ),
            hero_image_url="/placeholders/hero-bg.jpg",
        )
    )
    db.commit()


def seed_highlights(db) -> None:
    if db.query(Highlight).first():
        return
    highlights = [
        (
            "piggy-bank",
            "Healthy piglets",
            "स्वस्थ पाठापाठी",
            "Our piglets are weaned, dewormed, and eating solid feed before they go to their new homes.",
            "हाम्रा पाठापाठीहरू नयाँ घर जानुअघि दूध छुटाइएका, जुकाको औषधि दिइएका र दाना खान बानी परेका हुन्छन्।",
        ),
        (
            "heart",
            "Cared for every day",
            "दैनिक हेरचाह",
            "With a small herd, every pig gets individual attention, a clean pen, and good feed.",
            "सानो बथान भएकाले हरेक सुँगुरले व्यक्तिगत ध्यान, सफा खोर र राम्रो दाना पाउँछ।",
        ),
        (
            "handshake",
            "Honest local service",
            "इमानदार स्थानीय सेवा",
            "We tell you exactly what we have — age, breed, and health — so you can buy with confidence.",
            "हामी उमेर, नश्ल र स्वास्थ्यबारे सही जानकारी दिन्छौं, ताकि तपाईं ढुक्क भएर किन्न सक्नुहुन्छ।",
        ),
    ]
    db.add_all(
        Highlight(
            icon=icon,
            title_en=title_en,
            title_ne=title_ne,
            description_en=desc_en,
            description_ne=desc_ne,
            order=i,
        )
        for i, (icon, title_en, title_ne, desc_en, desc_ne) in enumerate(highlights, start=1)
    )
    db.commit()


def seed_about_page(db) -> None:
    if db.query(AboutPage).first():
        return
    db.add(
        AboutPage(
            story_en=(
                "Bajgain Krishi Farm is a small family pig farm in Pokhara, Nepal. "
                "We started in 2023 with a handful of pigs and a simple goal: raise "
                "healthy animals and treat our customers honestly.\n\n"
                "Today we focus on two things only — piglets for local farmers who "
                "want to raise their own pigs, and quality boars and sows for "
                "breeding. We are still small and growing, and we like it that way: "
                "it means every animal gets real care."
            ),
            story_ne=(
                "बजगाईं कृषि फार्म पोखरा, नेपालमा रहेको एउटा सानो पारिवारिक सुँगुर फार्म "
                "हो। हामीले सन् २०२३ मा केही सुँगुरहरूबाट सुरु गरेका हौं। हाम्रो लक्ष्य सरल "
                "छ: स्वस्थ जनावर हुर्काउने र ग्राहकहरूसँग इमानदार व्यवहार गर्ने।\n\n"
                "अहिले हामी दुई कुरामा मात्र केन्द्रित छौं — आफ्नै सुँगुर पाल्न चाहने "
                "किसानहरूका लागि पाठापाठी, र प्रजननका लागि राम्रा भाले र माउहरू। हामी "
                "अझै साना छौं र बिस्तारै बढ्दैछौं — यसैले हरेक जनावरले साँचो हेरचाह पाउँछ।"
            ),
            practices_en=(
                "Our pigs live in simple, clean pens with space to move, fresh water, "
                "and a balanced diet of local feed. Piglets stay with their mothers "
                "until they are properly weaned. We deworm and monitor every animal, "
                "and when a pig needs a vet, we call one — we would rather be honest "
                "about an animal's health than make a quick sale."
            ),
            practices_ne=(
                "हाम्रा सुँगुरहरू सफा र फराकिलो खोरमा बस्छन्, जहाँ हिँडडुल गर्ने ठाउँ, सफा "
                "पानी र स्थानीय दानाको सन्तुलित आहार पाउँछन्। पाठापाठीहरू राम्ररी दूध "
                "नछुटेसम्म आमासँगै बस्छन्। हामी हरेक जनावरलाई जुकाको औषधि दिन्छौं र "
                "स्वास्थ्यको निगरानी गर्छौं। जनावर बिरामी परेमा पशु चिकित्सक बोलाउँछौं — "
                "हतारमा बेच्नुभन्दा जनावरको स्वास्थ्यबारे इमानदार हुनु नै हामीलाई ठीक "
                "लाग्छ।"
            ),
            owner_name="The Bajgain Family",
            owner_message_en=(
                "Namaste! Thank you for visiting our farm's website. We may be a "
                "small farm, but we put our hearts into every animal we raise. Come "
                "visit us — we are always happy to show you around."
            ),
            owner_message_ne=(
                "नमस्ते! हाम्रो फार्मको वेबसाइट हेर्नुभएकोमा धन्यवाद। हाम्रो फार्म सानो होला, "
                "तर हामी हरेक जनावरलाई मन लगाएर हुर्काउँछौं। फार्ममा घुम्न आउनुहोस् — "
                "तपाईंलाई फार्म देखाउन पाउँदा हामीलाई खुशी लाग्छ।"
            ),
            owner_photo_url="/placeholders/team-owner.jpg",
            farm_photo_url="/placeholders/gallery-farm-life-1.jpg",
        )
    )
    db.commit()


def seed_pigs(db) -> None:
    if db.query(Pig).first():
        return
    today = date.today()
    pigs = [
        Pig(
            name_en="Yorkshire cross piglet",
            name_ne="योर्कशायर क्रस पाठो",
            listing_type=ListingType.piglet,
            breed_en="Yorkshire cross",
            breed_ne="योर्कशायर क्रस",
            gender=PigGender.male,
            date_of_birth=today - timedelta(weeks=8),
            price=8000,
            status=PigStatus.available,
            description_en=(
                "Playful, healthy piglet. Weaned, dewormed, and eating solid feed — "
                "ready for a new home."
            ),
            description_ne=(
                "चञ्चल र स्वस्थ पाठो। दूध छुटाइएको, जुकाको औषधि दिइएको र दाना खान "
                "बानी परेको — नयाँ घर जान तयार।"
            ),
            image_urls=["/placeholders/product-piglet-1.jpg"],
            order=1,
        ),
        Pig(
            name_en="Landrace cross piglet",
            name_ne="ल्यान्ड्रेस क्रस पाठी",
            listing_type=ListingType.piglet,
            breed_en="Landrace cross",
            breed_ne="ल्यान्ड्रेस क्रस",
            gender=PigGender.female,
            date_of_birth=today - timedelta(weeks=7),
            price=None,
            status=PigStatus.available,
            description_en=(
                "Calm female piglet from a healthy litter. Contact us for the price "
                "and to arrange a visit."
            ),
            description_ne=(
                "स्वस्थ बथानकी शान्त स्वभावकी पाठी। मूल्य र फार्म भ्रमणका लागि "
                "हामीलाई सम्पर्क गर्नुहोस्।"
            ),
            image_urls=["/placeholders/product-piglet-2.jpg"],
            order=2,
        ),
        Pig(
            name_en="Young Duroc boar",
            name_ne="जवान ड्युरक भाले",
            listing_type=ListingType.breeding,
            breed_en="Duroc",
            breed_ne="ड्युरक",
            gender=PigGender.male,
            date_of_birth=today - timedelta(days=310),
            price=35000,
            status=PigStatus.available,
            description_en=(
                "Strong young boar from a healthy line, suitable for starting or "
                "improving a breeding herd."
            ),
            description_ne=(
                "स्वस्थ वंशको बलियो जवान भाले, प्रजनन बथान सुरु गर्न वा सुधार्न "
                "उपयुक्त।"
            ),
            image_urls=["/placeholders/breed-duroc.jpg"],
            order=3,
        ),
        Pig(
            name_en="Landrace breeding sow",
            name_ne="ल्यान्ड्रेस प्रजनन माउ",
            listing_type=ListingType.breeding,
            breed_en="Landrace",
            breed_ne="ल्यान्ड्रेस",
            gender=PigGender.female,
            date_of_birth=today - timedelta(days=600),
            price=None,
            status=PigStatus.reserved,
            description_en=(
                "Gentle sow with one healthy litter raised on our farm. Currently "
                "reserved — contact us to hear about upcoming litters."
            ),
            description_ne=(
                "हाम्रै फार्ममा एक स्वस्थ बेत हुर्काएकी शान्त माउ। हाल बुक भइसकेको — "
                "आगामी बेतबारे जान्न हामीलाई सम्पर्क गर्नुहोस्।"
            ),
            image_urls=["/placeholders/product-breeding-sow.jpg"],
            order=4,
        ),
    ]
    db.add_all(pigs)
    db.commit()


def seed_gallery(db) -> None:
    if db.query(Album).first() or db.query(GalleryImage).first():
        return
    albums = [
        Album(title_en="Our Pigs", title_ne="हाम्रा सुँगुरहरू", order=1),
        Album(title_en="Around the Farm", title_ne="फार्म वरिपरि", order=2),
    ]
    db.add_all(albums)
    db.commit()

    plan = [
        (albums[0], "animals", "Our healthy, well-cared-for pigs", "हाम्रा स्वस्थ र राम्रो हेरचाह पाएका सुँगुरहरू"),
        (albums[1], "farm-life", "Everyday life around the farm", "फार्म वरिपरिको दैनिक जीवन"),
    ]
    items = []
    order = 1
    for album, slug, caption_en, caption_ne in plan:
        for i in range(1, 4):
            items.append(
                GalleryImage(
                    album_id=album.id,
                    caption_en=caption_en,
                    caption_ne=caption_ne,
                    image_url=f"/placeholders/gallery-{slug}-{i}.jpg",
                    order=order,
                )
            )
            order += 1
    db.add_all(items)
    db.commit()


def seed_page_banners(db) -> None:
    if db.query(PageBanners).first():
        return
    db.add(PageBanners())
    db.commit()


def run() -> None:
    Base.metadata.create_all(bind=engine)  # no-op if Alembic already migrated
    db = SessionLocal()
    try:
        seed_admin_user(db)
        seed_farm_info(db)
        seed_home_page(db)
        seed_highlights(db)
        seed_about_page(db)
        seed_page_banners(db)
        seed_pigs(db)
        seed_gallery(db)
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
