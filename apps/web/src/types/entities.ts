export interface Timestamped {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface FarmInfo extends Timestamped {
  farm_name_en: string;
  farm_name_ne: string;
  description_en: string;
  description_ne: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  address_en: string;
  address_ne: string;
  hours_en: string;
  hours_ne: string;
  latitude: number | null;
  longitude: number | null;
  google_maps_embed_code: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  established_year: number;
}

export interface HomePage extends Timestamped {
  hero_title_en: string;
  hero_title_ne: string;
  hero_subtitle_en: string;
  hero_subtitle_ne: string;
  hero_image_url: string | null;
  hero_video_url: string | null;
}

export interface AboutPage extends Timestamped {
  story_en: string;
  story_ne: string;
  practices_en: string;
  practices_ne: string;
  owner_name: string;
  owner_message_en: string;
  owner_message_ne: string;
  owner_photo_url: string | null;
  farm_photo_url: string | null;
}

export interface PageBanners extends Timestamped {
  about_banner_url: string | null;
  piglets_banner_url: string | null;
  breeding_banner_url: string | null;
  gallery_banner_url: string | null;
  location_banner_url: string | null;
  contact_banner_url: string | null;
}

export interface Highlight extends Timestamped {
  icon: string;
  title_en: string;
  title_ne: string;
  description_en: string;
  description_ne: string;
  order: number;
}

export type ListingType = "piglet" | "breeding";
export type PigGender = "male" | "female";
export type PigStatus = "available" | "reserved" | "sold";

export interface Pig extends Timestamped {
  name_en: string;
  name_ne: string;
  listing_type: ListingType;
  breed_en: string;
  breed_ne: string;
  gender: PigGender;
  date_of_birth: string | null;
  price: number | null;
  status: PigStatus;
  description_en: string;
  description_ne: string;
  image_urls: string[];
  order: number;
}

export interface Album extends Timestamped {
  title_en: string;
  title_ne: string;
  order: number;
}

export interface GalleryImage extends Timestamped {
  album_id: string | null;
  caption_en: string | null;
  caption_ne: string | null;
  image_url: string | null;
  order: number;
}

export type PreferredContactMethod = "phone" | "email" | "whatsapp";
export type InquiryStatus = "new" | "contacted" | "closed";

export interface Inquiry extends Timestamped {
  name: string;
  phone: string;
  email: string;
  pig_id: string | null;
  interest: string | null;
  quantity: string | null;
  preferred_contact_method: PreferredContactMethod;
  message: string;
  status: InquiryStatus;
}

export interface InquiryCreate {
  name: string;
  phone: string;
  email: string;
  pig_id?: string | null;
  interest?: string | null;
  quantity?: string | null;
  preferred_contact_method: PreferredContactMethod;
  message: string;
}

export interface DashboardSummary {
  pigs: number;
  available_piglets: number;
  available_breeding_pigs: number;
  gallery_images: number;
  albums: number;
  highlights: number;
  inquiries: number;
  new_inquiries: number;
}
