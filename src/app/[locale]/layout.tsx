import "@/styles/globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
const rtlFont = localFont({ src: "../../assets/fonts/IRANSans.ttf" });
const ltrFont = Inter({ subsets: ["latin"] });
import { createTranslator, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getLangDir } from "rtl-detect";
import DirectionProvider from "@/providers/direction-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/auth.provider";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: {
      template: `%s | ${t("rootLayout.title")}`,
      default: `${t("rootLayout.title")}`,
    },
    description: t("rootLayout.description"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  };
}

export default async function RootLayout(props: Props) {
  const params = await props.params;
  const { children } = props;
  const { locale } = params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  const messages = await getMessages();
  const direction = getLangDir(locale);
  return (
    <html suppressHydrationWarning lang={locale} dir={direction}>
      <body
        suppressHydrationWarning={true}
        className={`${locale === "fa" ? rtlFont.className : ltrFont.className}`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <AuthProvider>
              <DirectionProvider direction={direction}>
                {children}
                <Toaster />
                <SonnerToaster />
              </DirectionProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
