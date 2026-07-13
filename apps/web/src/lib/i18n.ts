export type Locale = "en" | "ne";

export const LOCALE_COOKIE = "locale";
export const LOCALES: Locale[] = ["en", "ne"];

/**
 * Picks a bilingual DB field (`<field>_en` / `<field>_ne`) in the requested
 * locale, falling back to English when the Nepali value is empty.
 */
export function loc(obj: unknown, field: string, locale: Locale): string {
  if (!obj) return "";
  const record = obj as Record<string, unknown>;
  const localized = record[`${field}_${locale}`];
  if (typeof localized === "string" && localized.trim()) return localized;
  const fallback = record[`${field}_en`];
  return typeof fallback === "string" ? fallback : "";
}

const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"] as const;

export function toDevanagariDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

export function formatNumber(value: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat("en-IN").format(value);
  return locale === "ne" ? toDevanagariDigits(formatted) : formatted;
}

export function formatPrice(price: number | null | undefined, locale: Locale): string {
  if (price == null) {
    return locale === "ne" ? "मूल्यका लागि सम्पर्क गर्नुहोस्" : "Contact for price";
  }
  return locale === "ne" ? `रु ${formatNumber(price, "ne")}` : `Rs ${formatNumber(price, "en")}`;
}

/** Human-friendly age from a date of birth, e.g. "8 weeks old" / "८ हप्ताको". */
export function formatAge(dateOfBirth: string | null | undefined, locale: Locale): string | null {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return null;
  const days = Math.max(0, Math.floor((Date.now() - birth.getTime()) / 86_400_000));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  if (locale === "ne") {
    if (months < 3) return `${toDevanagariDigits(Math.max(weeks, 1))} हप्ताको`;
    if (years < 1) return `${toDevanagariDigits(months)} महिनाको`;
    const remMonths = Math.floor((days - years * 365.25) / 30.44);
    return remMonths > 0
      ? `${toDevanagariDigits(years)} वर्ष ${toDevanagariDigits(remMonths)} महिनाको`
      : `${toDevanagariDigits(years)} वर्षको`;
  }

  if (months < 3) {
    const w = Math.max(weeks, 1);
    return `${w} ${w === 1 ? "week" : "weeks"} old`;
  }
  if (years < 1) return `${months} ${months === 1 ? "month" : "months"} old`;
  const remMonths = Math.floor((days - years * 365.25) / 30.44);
  const yearPart = `${years} ${years === 1 ? "year" : "years"}`;
  return remMonths > 0 ? `${yearPart} ${remMonths} mo old` : `${yearPart} old`;
}

const en = {
  nav: {
    home: "Home",
    about: "About Our Farm",
    piglets: "Piglets",
    breedingPigs: "Breeding Pigs",
    gallery: "Gallery",
    location: "Find Us",
    contact: "Contact",
  },
  common: {
    contactUs: "Contact Us",
    getDirections: "Get directions on Google Maps",
    phone: "Phone",
    whatsapp: "WhatsApp",
    email: "Email",
    address: "Address",
    hours: "Opening Hours",
    since: "A small family farm since",
  },
  pig: {
    breed: "Breed",
    gender: "Gender",
    age: "Age",
    price: "Price",
    male: "Male",
    female: "Female",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    piglet: "Piglet",
    breeding: "Breeding pig",
    askAbout: "Ask about this pig",
    viewDetails: "View details",
  },
  home: {
    heroBadge: "A small family pig farm",
    seePiglets: "See Available Piglets",
    visitFarm: "Visit Our Farm",
    highlightsEyebrow: "Our Promise",
    highlightsTitle: "Why buy from us",
    availableEyebrow: "For Sale Now",
    availableTitle: "Pigs looking for a new home",
    availableDescription:
      "A few of the piglets and breeding pigs currently available at the farm.",
    viewPiglets: "All piglets",
    viewBreeding: "All breeding pigs",
    emptyPigs:
      "No pigs are listed for sale right now — contact us to hear about upcoming litters.",
    galleryEyebrow: "Gallery",
    galleryTitle: "A glimpse of the farm",
    galleryDescription: "Everyday life with our pigs, in pictures.",
    viewGallery: "View full gallery",
    mapEyebrow: "Visit Us",
    mapTitle: "Find our farm",
    mapNote: "Visitors are welcome — call ahead and we'll gladly show you around.",
    ctaTitle: "Looking for a piglet or breeding pig?",
    ctaDescription:
      "Call us or send a message — we're happy to tell you what's available and help you choose the right pig.",
    ctaButton: "Get in touch",
  },
  about: {
    eyebrow: "About Us",
    title: "About Our Farm",
    description: "Who we are and how we raise our pigs.",
    storyTitle: "Our story",
    practicesTitle: "How we raise our pigs",
    ownerTitle: "A note from the family",
  },
  listings: {
    pigletsEyebrow: "Piglets",
    pigletsTitle: "Available Piglets",
    pigletsDescription: "Healthy, weaned piglets ready for their new homes.",
    breedingEyebrow: "Breeding Stock",
    breedingTitle: "Available Breeding Pigs",
    breedingDescription: "Quality boars and sows for starting or growing your own herd.",
    empty:
      "Nothing is listed here right now. Please check back soon, or contact us to ask about upcoming litters.",
    back: "Back to all listings",
    detailsTitle: "Details",
    aboutPig: "About this pig",
    inquiryTitle: "Interested in this pig?",
    inquiryDescription: "Send us a message and we'll get back to you soon.",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Farm Gallery",
    description: "Photos from around the farm.",
    all: "All photos",
    empty: "No photos yet — please check back soon.",
  },
  location: {
    eyebrow: "Visit Us",
    title: "Find Our Farm",
    description: "Where we are and when we're open.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Contact Us",
    description: "Questions about our pigs or visiting the farm? We'd love to hear from you.",
    formTitle: "Send us a message",
    formDescription: "Fill in the form and we'll get back to you within 1–2 days.",
    interestedIn: "Asking about",
    name: "Your Name",
    namePlaceholder: "Full name",
    phone: "Phone Number",
    email: "Email Address",
    quantity: "How many pigs? (optional)",
    quantityPlaceholder: "e.g. 2 piglets",
    contactMethod: "How should we contact you?",
    message: "Your Message",
    messagePlaceholder: "Tell us what you're looking for…",
    send: "Send Message",
    sending: "Sending…",
    success: "Thank you! We've received your message and will be in touch soon.",
    error: "Something went wrong. Please try again, or call us directly.",
    errorName: "Please enter your name",
    errorPhone: "Please enter a valid phone number",
    errorEmail: "Please enter a valid email",
    errorMessage: "Please tell us a bit more (at least 10 characters)",
  },
  footer: {
    explore: "Pages",
    contact: "Contact",
    rights: "All rights reserved.",
  },
};

const ne: Dictionary = {
  nav: {
    home: "गृहपृष्ठ",
    about: "हाम्रो फार्म",
    piglets: "पाठापाठी",
    breedingPigs: "प्रजनन सुँगुर",
    gallery: "ग्यालरी",
    location: "ठेगाना",
    contact: "सम्पर्क",
  },
  common: {
    contactUs: "सम्पर्क गर्नुहोस्",
    getDirections: "गुगल नक्सामा बाटो हेर्नुहोस्",
    phone: "फोन",
    whatsapp: "व्हाट्सएप",
    email: "इमेल",
    address: "ठेगाना",
    hours: "खुल्ने समय",
    since: "सानो पारिवारिक फार्म, स्थापना",
  },
  pig: {
    breed: "नश्ल",
    gender: "लिङ्ग",
    age: "उमेर",
    price: "मूल्य",
    male: "भाले",
    female: "पोथी",
    available: "उपलब्ध",
    reserved: "बुक भइसकेको",
    sold: "बिक्री भइसकेको",
    piglet: "पाठो/पाठी",
    breeding: "प्रजनन सुँगुर",
    askAbout: "यो सुँगुरबारे सोध्नुहोस्",
    viewDetails: "विवरण हेर्नुहोस्",
  },
  home: {
    heroBadge: "सानो पारिवारिक सुँगुर फार्म",
    seePiglets: "उपलब्ध पाठापाठी हेर्नुहोस्",
    visitFarm: "फार्म घुम्न आउनुहोस्",
    highlightsEyebrow: "हाम्रो वाचा",
    highlightsTitle: "हामीबाट किन किन्ने?",
    availableEyebrow: "अहिले बिक्रीमा",
    availableTitle: "नयाँ घर खोज्दै गरेका सुँगुरहरू",
    availableDescription: "फार्ममा अहिले उपलब्ध केही पाठापाठी र प्रजनन सुँगुरहरू।",
    viewPiglets: "सबै पाठापाठी",
    viewBreeding: "सबै प्रजनन सुँगुर",
    emptyPigs:
      "अहिले बिक्रीका लागि कुनै सुँगुर सूचीमा छैन — आगामी बेतबारे जान्न हामीलाई सम्पर्क गर्नुहोस्।",
    galleryEyebrow: "ग्यालरी",
    galleryTitle: "फार्मको एक झलक",
    galleryDescription: "हाम्रा सुँगुरहरूसँगको दैनिक जीवन, तस्बिरमा।",
    viewGallery: "पूरा ग्यालरी हेर्नुहोस्",
    mapEyebrow: "भ्रमण गर्नुहोस्",
    mapTitle: "हाम्रो फार्म भेट्टाउनुहोस्",
    mapNote: "आगन्तुकहरूलाई स्वागत छ — पहिले फोन गर्नुहोस्, हामी खुशीसाथ फार्म देखाउनेछौं।",
    ctaTitle: "पाठापाठी वा प्रजनन सुँगुर खोज्दै हुनुहुन्छ?",
    ctaDescription:
      "फोन गर्नुहोस् वा सन्देश पठाउनुहोस् — के के उपलब्ध छ भन्न र उपयुक्त सुँगुर छान्न हामी सहयोग गर्छौं।",
    ctaButton: "सम्पर्कमा आउनुहोस्",
  },
  about: {
    eyebrow: "हाम्रोबारे",
    title: "हाम्रो फार्मबारे",
    description: "हामी को हौं र हामी कसरी सुँगुर हुर्काउँछौं।",
    storyTitle: "हाम्रो कथा",
    practicesTitle: "हामी कसरी सुँगुर हुर्काउँछौं",
    ownerTitle: "परिवारको भनाइ",
  },
  listings: {
    pigletsEyebrow: "पाठापाठी",
    pigletsTitle: "उपलब्ध पाठापाठी",
    pigletsDescription: "नयाँ घर जान तयार, स्वस्थ र दूध छुटाइएका पाठापाठीहरू।",
    breedingEyebrow: "प्रजनन सुँगुर",
    breedingTitle: "उपलब्ध प्रजनन सुँगुरहरू",
    breedingDescription: "आफ्नो बथान सुरु गर्न वा बढाउन राम्रा भाले र माउहरू।",
    empty:
      "अहिले यहाँ केही सूचीमा छैन। केही समयपछि फेरि हेर्नुहोस्, वा आगामी बेतबारे सोध्न हामीलाई सम्पर्क गर्नुहोस्।",
    back: "सबै सूचीमा फर्कनुहोस्",
    detailsTitle: "विवरण",
    aboutPig: "यो सुँगुरबारे",
    inquiryTitle: "यो सुँगुरमा रुचि छ?",
    inquiryDescription: "हामीलाई सन्देश पठाउनुहोस्, हामी चाँडै सम्पर्क गर्नेछौं।",
  },
  gallery: {
    eyebrow: "ग्यालरी",
    title: "फार्म ग्यालरी",
    description: "फार्म वरिपरिका तस्बिरहरू।",
    all: "सबै तस्बिर",
    empty: "अहिले कुनै तस्बिर छैन — केही समयपछि फेरि हेर्नुहोस्।",
  },
  location: {
    eyebrow: "भ्रमण गर्नुहोस्",
    title: "हाम्रो फार्म भेट्टाउनुहोस्",
    description: "हामी कहाँ छौं र कहिले खुल्छौं।",
  },
  contact: {
    eyebrow: "सम्पर्क",
    title: "सम्पर्क गर्नुहोस्",
    description:
      "सुँगुरबारे वा फार्म भ्रमणबारे केही सोध्नु छ? हामी तपाईंको कुरा सुन्न चाहन्छौं।",
    formTitle: "हामीलाई सन्देश पठाउनुहोस्",
    formDescription: "फारम भर्नुहोस्, हामी १–२ दिनभित्र जवाफ दिनेछौं।",
    interestedIn: "यसबारे सोध्दै",
    name: "तपाईंको नाम",
    namePlaceholder: "पूरा नाम",
    phone: "फोन नम्बर",
    email: "इमेल ठेगाना",
    quantity: "कति वटा सुँगुर? (वैकल्पिक)",
    quantityPlaceholder: "जस्तै: २ वटा पाठा",
    contactMethod: "हामीले कसरी सम्पर्क गरौं?",
    message: "तपाईंको सन्देश",
    messagePlaceholder: "तपाईंलाई के चाहिन्छ, हामीलाई भन्नुहोस्…",
    send: "सन्देश पठाउनुहोस्",
    sending: "पठाउँदै…",
    success: "धन्यवाद! तपाईंको सन्देश पायौं, चाँडै सम्पर्क गर्नेछौं।",
    error: "केही गडबड भयो। फेरि प्रयास गर्नुहोस्, वा सिधै फोन गर्नुहोस्।",
    errorName: "कृपया आफ्नो नाम लेख्नुहोस्",
    errorPhone: "कृपया सही फोन नम्बर लेख्नुहोस्",
    errorEmail: "कृपया सही इमेल लेख्नुहोस्",
    errorMessage: "कृपया अलि विस्तारमा लेख्नुहोस् (कम्तीमा १० अक्षर)",
  },
  footer: {
    explore: "पृष्ठहरू",
    contact: "सम्पर्क",
    rights: "सर्वाधिकार सुरक्षित।",
  },
};

export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = { en, ne };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}
