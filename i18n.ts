import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!['en', 'bn'].includes(locale as any)) notFound();

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
