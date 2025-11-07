// /src/i18n/navigation.js
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// routing already includes your pathnames map
export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname
} = createNavigation(routing);
