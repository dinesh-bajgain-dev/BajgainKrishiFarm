import {
  Handshake,
  Heart,
  Home,
  Leaf,
  Phone,
  PiggyBank,
  ShieldCheck,
  Sprout,
  Star,
  Sun,
  type LucideIcon,
} from "lucide-react";

/** Icons the owner can pick for homepage highlight cards. */
export const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  "piggy-bank": PiggyBank,
  heart: Heart,
  handshake: Handshake,
  leaf: Leaf,
  home: Home,
  sun: Sun,
  shield: ShieldCheck,
  star: Star,
  sprout: Sprout,
  phone: Phone,
};

export const HIGHLIGHT_ICON_OPTIONS = [
  { value: "piggy-bank", label: "Pig" },
  { value: "heart", label: "Heart" },
  { value: "handshake", label: "Handshake" },
  { value: "leaf", label: "Leaf" },
  { value: "home", label: "Home" },
  { value: "sun", label: "Sun" },
  { value: "shield", label: "Shield" },
  { value: "star", label: "Star" },
  { value: "sprout", label: "Plant" },
  { value: "phone", label: "Phone" },
];
