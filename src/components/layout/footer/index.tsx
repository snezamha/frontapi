"use client";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";
import { usePathname } from "next/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <footer
      className={`mt-auto bg-gray-100 dark:bg-gray-800 lg:bg-transparent lg:dark:bg-transparent ${
        isDashboard ? "xl:ms-[254px]" : ""
      }`}
    >
      <div className="mx-auto w-full max-w-screen-xl p-6 md:py-8">
        <div className="flex flex-col items-center justify-between text-gray-500 dark:text-gray-400 md:flex-row">
          {/* Copyright */}
          <div className="text-xs text-center mb-2 md:mb-0">
            {t("copyRight", { year: currentYear })}
          </div>
          {/* GitHub Link */}
          <a
            href="https://github.com/snezamha/frontapi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <Icon icon="octicon:mark-github-24" className="h-4 w-4 mx-2" />
            {t("viewSource")}
          </a>
        </div>
      </div>
    </footer>
  );
}
