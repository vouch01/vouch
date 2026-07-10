import { Store } from 'lucide-react';
import { HiOutlineUser } from "react-icons/hi2";

export const buildForCards = [
  {
    title: "For Vendors",
    description: "Focus on growing your business while Vouch handles the trust",
    icon: Store,
    accent: "primary",
    points: [
      "Get Paid only for successful delivery",
      "Reduce delivery rejection and losses",
      "Automatic payouts to your back account",
      "Real-time order and payment tracking",
    ],
    image: "/images/land-img-6.png",
  },
  {
    title: "For Buyers",
    description: "Shop confidently knowing your payments are protected",
    icon: HiOutlineUser,
    accent: "green-500",
    points: [
      "Pay securely with escrow protection",
      "Verify delivery before funds are released",
      "Raise disputes when needed",
      "Get refunds if issues aren’t resolved",
    ],
    image: "/images/land-img-5.png",
  },
];