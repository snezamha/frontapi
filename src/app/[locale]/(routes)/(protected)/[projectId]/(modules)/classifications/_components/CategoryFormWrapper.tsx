"use client";

import React from "react";
import { EntityAdminForm } from "@/components/shared/entity/form";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";

import {
  deleteCategory,
  createCategory,
  updateCategory,
} from "@/actions/categories";
import { categorySchema } from "@/schemas/category.schema";
import { Categories } from "@prisma/client";
import { getAllCategories } from "@/actions/categories";

interface CategoryFormProps {
  initData?: Categories | null;
}

interface CategoryFormData {
  id?: string;
  title?: string;
  parentId?: string | null;
  type: string;
  projectId: string;
}

const CategoryFormWrapper: React.FC<CategoryFormProps> = ({ initData }) => {
  const t = useTranslations("classifications");
  const { toast } = useToast();
  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryOptions, setCategoryOptions] = useState<
    {
      value: string;
      label: string;
      type: string;
      parentId?: string | null;
      translateOption: boolean;
    }[]
  >([]);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (!projectId) {
          throw new Error("Project ID is required");
        }
        const categories = await getAllCategories(projectId);
        if (categories && Array.isArray(categories)) {
          const options = categories.map((category) => ({
            value: category.id,
            label: category.title,
            type: category.type,
            parentId: category.parentId ?? null,
            translateOption: true,
          }));
          setCategoryOptions(options);
        }
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch categories");
      }
    };

    loadCategories();
  }, [projectId]);

  const categoryId = params?.categoryId;
  const filteredCategories = categoryOptions.filter(
    (category) =>
      category.value !== categoryId &&
      category.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const groupedCategories = filteredCategories.reduce((groups, category) => {
    const parentId = category.parentId || "root";
    if (!groups[parentId]) {
      groups[parentId] = [];
    }
    groups[parentId].push(category);
    return groups;
  }, {} as Record<string, { value: string; label: string; parentId?: string | null; type: string }[]>);
  const handleSubmit = async (data: CategoryFormData) => {
    try {
      const finalData = { ...data, projectId };
      const result = data.id
        ? await updateCategory(finalData as CategoryFormData)
        : await createCategory({ ...finalData, projectId: projectId! });

      if (result.success) {
        toast({
          description: t(result.success),
        });
      } else {
        toast({
          variant: "destructive",
          description: t(result.error),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred: " + (error as Error).message,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      const result = await deleteCategory(projectId, id);
      if (result.success) {
        toast({
          description: t(result.success),
        });
      } else {
        toast({
          variant: "destructive",
          description: t(result.error),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred: " + (error as Error).message,
      });
    }
  };

  return (
    <EntityAdminForm
      basePath={`/${projectId}`}
      entityName="classification"
      initData={initData}
      entitySchema={categorySchema(t)}
      entityDefaultValues={{
        id: undefined,
        title: "",
        parentId: null,
        type: "product",
        projectId,
      }}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      className="grid grid-cols-1 gap-5"
      sections={[
        {
          sectionTitle: "",
          sectionClassName: "grid lg:grid-cols-3 gap-5",
          fields: [
            {
              name: "title",
              label: "title",
              type: "text",
              hasSlug: true,
              placeholder: "enterTitle",
              className: "col-span-1",
              sortLevel: 1,
            },
            {
              name: "parentId",
              label: "parentCategory",
              type: "custom",
              render: ({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectParentCategory")} />
                  </SelectTrigger>
                  <SelectContent onMouseDown={(e) => e.stopPropagation()}>
                    {categoryOptions.some(
                      (option) => option.translateOption,
                    ) && (
                      <div className="px-3 py-1">
                        <Input
                          placeholder={t("searchCategories")}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                    <SelectItem key="null" value="null">
                      {t("withoutParentCategory")}
                    </SelectItem>
                    {Object.entries(groupedCategories).map(
                      ([parentId, categories]) =>
                        parentId === "root" ? (
                          categories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                              <span className="text-[8px] text-blue-600">
                                {" "}
                                ({t(category.type)})
                              </span>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectGroup key={parentId}>
                            <SelectLabel>
                              <span className="mx-1 text-gray-500">
                                {t("group") +
                                  ": " +
                                  (categoryOptions.find(
                                    (option) => option.value === parentId,
                                  )?.label || "unknownGroupLabel")}
                              </span>
                            </SelectLabel>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}{" "}
                                <span className="text-[8px] text-blue-600">
                                  {" "}
                                  ({t(category.type)})
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ),
                    )}
                  </SelectContent>
                </Select>
              ),
              placeholder: "selectParentCategory",
              className: "col-span-1",
              sortLevel: 2,
            },
            {
              name: "type",
              label: "type",
              type: "select",
              options: [
                { value: "product", label: t("product") },
                { value: "blog", label: t("blog") },
              ],
              placeholder: "selectType",
              className: "col-span-1",
              sortLevel: 3,
            },
          ],
        },
      ]}
    />
  );
};

export default CategoryFormWrapper;
