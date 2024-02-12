import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export type Languages = 'pt' | 'en';
export const locales: Languages[] = ['pt', 'en'];
export const localePrefix = 'as-needed';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });