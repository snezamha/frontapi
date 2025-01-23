import { createTranslator, useTranslations } from "next-intl";
import { getMessages } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  const t = createTranslator({ locale, messages });
  return {
    title: t("home.title"),
  };
}

export default function Home() {
  const t = useTranslations("home");

  return (
    <>
      <main className="flex flex-col gap-8 items-start">
        <h1 className="text-3xl">{t("title")}</h1>
        <p className="text-lg">{t("description")}</p>
      </main>
    </>
  );
}
