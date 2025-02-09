import type { Metadata } from 'next';
import '@/styles/globals.css';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
const rtlFont = localFont({ src: '../../assets/fonts/IRANSans.ttf' });
const ltrFont = Inter({ subsets: ['latin'] });
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from '@/components/ui/toaster';
import DirectionProvider from '@/providers/direction-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await Promise.resolve(params);

  if (!routing.locales.includes(locale as 'en' | 'fa')) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={['fa'].includes(locale) ? 'rtl' : 'ltr'}
    >
      <body
        suppressHydrationWarning
        className={`${locale === 'fa' ? rtlFont.className : ltrFont.className}`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <DirectionProvider
              direction={['fa'].includes(locale) ? 'rtl' : 'ltr'}
            >
              {children}
              <Toaster />
            </DirectionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
