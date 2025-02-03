"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { CheckIcon, LanguagesIcon, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Flag from "react-world-flags";

export default function LocalSwitcher() {
  const t = useTranslations("locale");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const localActive = useLocale();
  const locales = [
    {
      name: t("english"),
      value: "en",
      code: "gb",
    },
    {
      name: t("persian"),
      value: "fa",
      code: "ir",
    },
  ];
  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          {isPending ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <LanguagesIcon className="w-5 h-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.value}
            onClick={() => onSelectChange(locale.value)}
            disabled={locale.value === localActive}
          >
            <Flag
              code={locale.code}
              style={{ width: "25px", height: "25px" }}
            />
            <span className="mx-1">{locale.name}</span>
            {locale.value === localActive ? (
              <CheckIcon className="w-5 h-5 me-auto" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
