"use client";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <section className="flex items-center">
        <div className="container py-2">
          <div className="flex flex-col items-center justify-between text-gray-500 md:flex-row dark:text-gray-400">
            <div className="text-xs text-center">
              {t("copyRight", { year: currentYear })}
            </div>
            <a
              href="https://github.com/snezamha/frontapi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Icon icon="octicon:mark-github-24" className="w-4 h-4 mx-2" />
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
}
