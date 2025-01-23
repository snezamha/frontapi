import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

const Loading = () => {
  const t = useTranslations();
  return (
    <div className="flex w-full h-full items-center justify-center gap-2">
      <span className="rounded-full animate-spin">
        <Loader className="h-5 w-5" />
      </span>
      <span className="animate-pulse">{t("loadingText")}</span>
    </div>
  );
};

export { Loading };
