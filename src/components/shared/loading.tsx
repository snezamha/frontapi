import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

const Loading = () => {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-center w-full h-full gap-2">
      <span className="rounded-full animate-spin">
        <Loader className="w-5 h-5" />
      </span>
      <span className="animate-pulse">{t("loadingText")}</span>
    </div>
  );
};

export { Loading };
