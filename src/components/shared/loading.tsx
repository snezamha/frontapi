import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

const Loading = () => {
  const t = useTranslations();
  return (
    <div className="flex w-full h-full items-center justify-center gap-5">
      <span className="px-4 py-2 rounded-full animate-spin">
        <Loader className="h-5 w-5" />
      </span>
      <span className="animate-pulse">{t("loadingText")}</span>
    </div>
  );
};

export { Loading };
