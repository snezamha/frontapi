"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icon } from "@/components/shared/icon";

interface ProjectSwitcherProps
  extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  items: { title: string; id: string }[];
}

export default function ProjectSwitcher({
  items = [],
  className,
  ...props
}: ProjectSwitcherProps) {
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.title,
    value: item.id,
  }));

  const currentProject = formattedItems.find(
    (item) => item.value === params.projectId,
  );

  const [openPopover, setOpenPopover] = React.useState(false);

  const onProjectSelect = (project: { value: string; label: string }) => {
    setOpenPopover(false);
    router.push(`/${project.value}/dashboard`);
  };

  const t = useTranslations("projects.projectSwitcher");
  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openPopover}
            aria-label="Select a store"
            className={cn("w-full justify-between", className)}
            {...props}
          >
            <Icon icon="heroicons:folder" />
            {currentProject?.label}
            <ChevronsUpDown className="opacity-50" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder={t("selectProject")} />
              <CommandEmpty>{t("noProjectFound")}</CommandEmpty>
              <CommandGroup heading={t("projects")}>
                {formattedItems.map((project) => (
                  <CommandItem
                    key={project.value}
                    onSelect={() => onProjectSelect(project)}
                    className="text-sm flex items-center justify-between"
                  >
                    <Icon icon="heroicons:folder" />
                    <span className="flex-1 text-start">
                      {project.label}
                    </span>{" "}
                    <Check
                      className={cn(
                        "h-4 w-4",
                        currentProject?.value === project.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
