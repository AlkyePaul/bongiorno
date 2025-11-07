export const LOCALES = ['it', 'es', 'en', 'fr'];

export function generateLocaleParams() {
  console.log('LOCALES', LOCALES);
  const params = LOCALES.map((locale) => ({ locale }));
  console.log('generateLocaleParams ->', params);
  return params;
}
