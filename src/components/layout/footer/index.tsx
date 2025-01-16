import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gray-100 dark:bg-gray-800">
      <div className="mx-auto w-full max-w-screen-xl p-6 md:py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between text-gray-500 dark:text-gray-400">
          <div className="text-sm text-center md:text-left mb-2 md:mb-0">
            {t("copyRight", { year: currentYear })}
          </div>
          <a
            href="https://github.com/snezamha/frontapi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <Icon icon="octicon:mark-github-24" className="h-5 w-5 mx-2" />
            {t("viewSource")}
          </a>
        </div>
      </div>
    </footer>
  );
}
