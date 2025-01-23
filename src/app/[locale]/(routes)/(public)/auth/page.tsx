import { AuthComponent } from "./_component/AuthComponent";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { createTranslator } from "next-intl";
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
    title: t("auth.authentication"),
  };
}

const Auth = async () => {
  const session = await auth();
  if (session) {
    return redirect("/");
  }
  return (
    <div className="h-full">
      <div>
        <AuthComponent />
      </div>
    </div>
  );
};

export default Auth;
