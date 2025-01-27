"use client";

import * as React from "react";
import ReactSelect from "react-select";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { useSidebar } from "@/providers/sidebar-provider";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ProjectSwitcherProps {
  items: { title: string; id: string }[];
  className?: string;
}

export default function ProjectSwitcher({
  items = [],
  className,
}: ProjectSwitcherProps) {
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.title,
    value: item.id,
  }));

  const pathename = usePathname();
  const isDirectProjectPath = pathename.startsWith(`/${params?.projectId}`);

  const currentProject = isDirectProjectPath
    ? formattedItems.find((item) => item.value === params?.projectId)
    : null;

  const { setOpen } = useSidebar();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const onProjectSelect = (
    selected: { value: string; label: string } | null,
  ) => {
    if (selected) {
      router.push(`/${selected.value}/dashboard`);
    } else {
      router.push(`/projects`);
    }
    if (!isDesktop) {
      setOpen(false);
    }
  };

  const t = useTranslations("projects.projectSwitcher");

  return (
    <div className={className}>
      <ReactSelect
        options={formattedItems}
        value={currentProject || null}
        onChange={(selected) =>
          onProjectSelect(selected as { value: string; label: string } | null)
        }
        placeholder={t("selectProject")}
        isSearchable
        noOptionsMessage={() => t("noProjectFound")}
        className="w-full"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#ccc",
            boxShadow: "none",
            "&:hover": { borderColor: "#aaa" },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#f0f0f0" : "white",
            "&:hover": { backgroundColor: "#e6e6e6" },
            color: "#333",
          }),
        }}
      />
    </div>
  );
}
