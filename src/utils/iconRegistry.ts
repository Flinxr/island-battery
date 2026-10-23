import React from 'react';
import {
  Battery,
  BatteryCharging,
  Smartphone,
  Speaker,
  Headphones,
  Zap,
  Cable,
  HardDrive,
  Shield,
  Sparkles,
  Navigation,
  Wrench,
  Camera,
  Watch,
  Cpu,
  Wifi,
  Bluetooth,
  Radio,
  Plug,
  Layers,
  Box,
  Disc,
  FolderSync,
  Compass,
  Mic,
  LucideIcon,
  ShoppingBag,
  Tag,
  Grid,
} from 'lucide-react';

export interface IconOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const CATEGORY_ICONS_REGISTRY: Record<string, { label: string; icon: LucideIcon }> = {
  battery: { label: 'باتری و تقویت‌کننده', icon: Battery },
  screen: { label: 'صفحه نمایش و ال‌سی‌دی', icon: Smartphone },
  speaker: { label: 'اسپیکر و بلندگو', icon: Speaker },
  headphones: { label: 'هندزفری و هدفون', icon: Headphones },
  charger: { label: 'شارژر و آداپتور', icon: Zap },
  cable: { label: 'کابل و رابط', icon: Cable },
  powerbank: { label: 'پاوربانک و شارژر همراه', icon: BatteryCharging },
  case: { label: 'قاب و گارد گوشی', icon: Shield },
  glass: { label: 'گلس و محافظ صفحه', icon: Sparkles },
  holder: { label: 'هولدر و پایه نگهدارنده', icon: Navigation },
  tools: { label: 'ابزار و قطعات تعمیرات', icon: Wrench },
  storage: { label: 'فلش، رم و حافظه', icon: HardDrive },
  camera: { label: 'لنز، رینگ‌لایت و عکاسی', icon: Camera },
  smartwatch: { label: 'لوازم ساعت هوشمند', icon: Watch },
  cpu: { label: 'آی‌سی و بردهای الکترونیکی', icon: Cpu },
  bluetooth: { label: 'دانگل و تجهیزات بلوتوث', icon: Bluetooth },
  plug: { label: 'تبدیل برق و چندراهی', icon: Plug },
  layers: { label: 'بسته‌های تخفیفی و پک‌ها', icon: Layers },
  generic: { label: 'سایر لوازم جانبی', icon: Box },
};

export const AVAILABLE_ICON_KEYS = Object.keys(CATEGORY_ICONS_REGISTRY);

export function getCategoryIcon(key: string): LucideIcon {
  return CATEGORY_ICONS_REGISTRY[key]?.icon || Box;
}
