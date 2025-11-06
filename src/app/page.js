import {redirect} from 'next/navigation';

export default function RootRedirect() {
  // Redirect root to the default locale
  redirect('/it');
}
