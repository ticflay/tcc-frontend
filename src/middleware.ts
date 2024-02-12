import createIntlMiddleware from 'next-intl/middleware';
import { localePrefix, locales } from './navigation';


export default createIntlMiddleware({
  locales,
  localePrefix,
  defaultLocale: 'pt'
});

// only applies this middleware to files in the app directory
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

