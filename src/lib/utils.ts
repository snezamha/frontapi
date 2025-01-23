import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number, locale: string) {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return "-";
  }
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function convertToSlug(titleStr: string) {
  titleStr = titleStr.replace(/^\s+|\s+$/g, '');
  titleStr = titleStr.toLowerCase();
  titleStr = titleStr
    .replace(/[^a-z0-9_\s-ءاأإآؤئبتثجحخدذرزسشصضطظعغفقكلمنهويةى]#u/, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const slugStr = titleStr;
  return slugStr;
}
