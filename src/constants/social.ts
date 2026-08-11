import type { ComponentType } from 'react';
import {
  FaInstagram,
  FaTelegram,
  FaTiktok,
  FaYoutube,
  FaPinterest,
} from 'react-icons/fa';
import { SALON_TELEGRAM } from './contact';

export type Social = {
  id: string;
  name: string;
  handle: string;      // "@amira_bridal"
  url: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  color: string;       // Tailwind bg class
};

export const SOCIALS: Social[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@amira_bridal',
    url: 'https://instagram.com/amira_bridal',
    icon: FaInstagram,
    color: 'bg-brand-gradient text-white',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    handle: `@${SALON_TELEGRAM}`,
    url: `https://t.me/${SALON_TELEGRAM}`,
    icon: FaTelegram,
    color: 'bg-[#229ED9] text-white',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@amira_bridal',
    url: 'https://tiktok.com/@amira_bridal',
    icon: FaTiktok,
    color: 'bg-black text-white',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@amira_bridal',
    url: 'https://youtube.com/@amira_bridal',
    icon: FaYoutube,
    color: 'bg-[#FF0000] text-white',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    handle: 'amira_bridal',
    url: 'https://pinterest.com/amira_bridal',
    icon: FaPinterest,
    color: 'bg-[#E60023] text-white',
  },
];
