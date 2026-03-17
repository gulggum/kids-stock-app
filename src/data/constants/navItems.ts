import {
  Home,
  TrendingUp,
  Wallet,
  MessageCircle,
  User,
  ShoppingBag,
} from "lucide-react";

export const navItems = [
  { path: "/", label: "홈", icon: Home, color: "accentBlue" },
  { path: "/market", label: "마켓", icon: TrendingUp, color: "accentGreen" },
  { path: "/portfolio", label: "자산", icon: Wallet, color: "secondary" },
  {
    path: "/community",
    label: "커뮤니티",
    icon: MessageCircle,
    color: "accentPurple",
  },
  { path: "/character", label: "캐릭터", icon: User, color: "accentPink" },
  { path: "/shop", label: "상점", icon: ShoppingBag, color: "primary" },
];
