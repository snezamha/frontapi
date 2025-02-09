import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { getMessages, getTranslations } from 'next-intl/server';
import { createTranslator } from 'next-intl';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t('dashboardMenu.dashboard'),
  };
}

export default async function Profile() {
  const t = await getTranslations('dashboardMenu');
  const breadcrumbItems = [{ title: t('dashboard'), link: '/dashboard' }];
  return (
    <>
      <Card>
        <CardHeader className="mb-6 border-b">
          <CardTitle>
            <Breadcrumbs items={breadcrumbItems} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4"></CardContent>
      </Card>
    </>
  );
}
