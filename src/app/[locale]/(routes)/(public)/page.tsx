import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import HeadingText from '@/components/shared/heading-text';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Briefcase, ShoppingCart, BarChart, RefreshCw } from 'lucide-react';

function Cards({ t }: { t: (key: string) => string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-8">
      {[
        { icon: Briefcase, title: 'projectTitle', desc: 'projectDescription' },
        { icon: ShoppingCart, title: 'shopTitle', desc: 'shopDescription' },
        {
          icon: BarChart,
          title: 'analyticsTitle',
          desc: 'analyticsDescription',
        },
        { icon: RefreshCw, title: 'updateTitle', desc: 'updateDescription' },
      ].map(({ icon: Icon, title, desc }, index) => (
        <Card
          key={index}
          className="flex flex-col items-center text-center justify-between gap-4 p-6 md:p-8 dark:bg-secondary rounded-xl shadow-lg"
        >
          <Icon size={40} className="text-primary" />
          <CardTitle>{t(title)}</CardTitle>
          <CardDescription>{t(desc)}</CardDescription>
        </Card>
      ))}
    </div>
  );
}

export default async function Home() {
  const t = await getTranslations({ namespace: 'homePage' });

  return (
    <>
      <section className="space-y-8 py-12 text-center px-4">
        <div className="container flex flex-col items-center gap-6 max-w-4xl mx-auto">
          <Link
            href={siteConfig.links.github}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            {t('openSource')}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">{t('heroTitle')}</h1>
          <p className="max-w-2xl text-muted-foreground sm:text-lg">
            {t('heroDescription')}
          </p>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: 'lg' }))}
          >
            {t('getStarted')}
          </Link>
        </div>
      </section>

      <section className="bg-secondary py-12" id="features">
        <div className="container space-y-8 text-center">
          <HeadingText subtext={t('featuresSubtext')}>
            {t('featuresTitle')}
          </HeadingText>
          <Cards t={t} />
        </div>
      </section>

      <section className="container py-12 text-center px-4">
        <div className="flex flex-col items-center gap-6">
          <HeadingText subtext={t('openSourceSubtext')} className="text-center">
            {t('openSourceTitle')}
          </HeadingText>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            className={`w-[10rem] gap-2 ${cn(buttonVariants({ variant: 'outline', size: 'sm' }))}`}
          >
            {t('github')}
          </Link>
        </div>
      </section>
    </>
  );
}
