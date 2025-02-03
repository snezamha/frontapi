"use client";

import * as React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { shareProjectModalSchema } from "@/schemas/project.schema";
import { Button } from "@/components/ui/button";
import { Permission } from "@prisma/client";
import { useEffect, useState } from "react";
import { fetchUsers, shareProject } from "@/actions/projects";
import ReactSelect, { SingleValue } from "react-select";
import { getProjectById } from "@/actions/projects";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/shared/icon";
import { Loading } from "@/components/shared/loading";
import { useRouter } from "next/navigation";

const useFetchData = <T,>(
  fetchFunction: () => Promise<T[]>,
  t: (key: string) => string,
  errorKey: string,
): {
  data: T[];
  loading: boolean;
  disabled: boolean;
} => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setDisabled(true);
        const result = await fetchFunction();
        setData(result);
      } catch (error) {
        toast({
          variant: "destructive",
          description: `${t(errorKey)}: ${(error as Error).message}`,
        });
      } finally {
        setLoading(false);
        setDisabled(false);
      }
    };

    loadData();
  }, [fetchFunction, t, toast, errorKey]);

  return { data, loading, disabled };
};

const ALL_PERMISSIONS: Permission[] = [
  "FULLACCESS",
  "ADD",
  "EDIT",
  "DELETE",
  "VIEW",
];

interface Option {
  value: string;
  label: string;
}

interface ShareProjectModalProps {
  projectId: string;
}

const ShareProjectForm: React.FC<ShareProjectModalProps> = ({ projectId }) => {
  const t = useTranslations("projects");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingShares, setLoadingShares] = useState(false);
  const schema = shareProjectModalSchema(t);
  const router = useRouter();

  const form = useForm<z.infer<ReturnType<typeof shareProjectModalSchema>>>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId,
      items: [],
    },
  });
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const {
    data: allUsers,
    loading: loadingUsers,
    disabled: disabledUsers,
  } = useFetchData(fetchUsers, t, "failedToFetchUsers");
  const [ownerId, setOwnerId] = useState<string | null>(null);
  useEffect(() => {
    async function fetchShares() {
      if (!projectId) return;
      setLoadingShares(true);
      try {
        const project = await getProjectById(projectId);
        if (project && "userProjects" in project && project.userProjects) {
          setOwnerId(project.ownerId);
          const existingShares = project.userProjects.map((up) => ({
            userId: up.userId,
            permissions: up.permissions,
          }));
          form.reset({
            projectId: projectId,
            items: existingShares,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingShares(false);
      }
    }

    fetchShares();
  }, [projectId, form]);
  const onSubmit = async (
    values: z.infer<ReturnType<typeof shareProjectModalSchema>>,
  ) => {
    setLoading(true);
    try {
      const result = await shareProject({
        parsedInput: {
          ...values,
          items: values.items.map((item) => ({
            ...item,
            permissions: item.permissions as Permission[],
          })),
        },
      });
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
      router.refresh();
    } catch (error: unknown) {
      toast({
        description: (error as Error)?.message
          ? t((error as Error).message)
          : t("somethingWentWrong"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="px-4 py-4">
          {loadingShares ? (
            <div className="flex items-center justify-center w-full h-36">
              <Loading />
            </div>
          ) : (
            <>
              {fields.map((field, index) => {
                const selectedUserIdsInOtherRows = fields
                  .filter((_, i) => i !== index)
                  .map((item) => item.userId)
                  .filter(Boolean);
                const blockedUserIdsSet = new Set(selectedUserIdsInOtherRows);
                const userOptionsForRow: Option[] = allUsers
                  .filter((user) => {
                    if (
                      blockedUserIdsSet.has(user.id) &&
                      user.id !== field.userId
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map((user) => ({
                    value: user.id,
                    label: user.email + (user.name ? ` - ${user.name}` : ""),
                  }));
                return (
                  <div
                    key={field.id}
                    className={`${
                      field.userId === ownerId ? "hidden" : "block"
                    } mb-6 flex flex-col gap-4 rounded-md border border-gray-200 p-4 `}
                  >
                    <FormField
                      control={control}
                      name="projectId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="hidden" value={field.value} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-4 md:flex-row">
                      <FormField
                        control={control}
                        name={`items.${index}.userId`}
                        render={({ field: userField }) => (
                          <FormItem className="w-full">
                            <FormLabel>{t("user")}</FormLabel>
                            <FormControl>
                              <ReactSelect
                                isLoading={loadingUsers}
                                isDisabled={disabledUsers}
                                options={userOptionsForRow}
                                onChange={(
                                  selectedOption: SingleValue<Option>,
                                ) =>
                                  userField.onChange(
                                    selectedOption?.value || "",
                                  )
                                }
                                value={
                                  userOptionsForRow.find(
                                    (option) =>
                                      option.value === userField.value,
                                  ) || null
                                }
                                placeholder={t("searchUser")}
                                isSearchable
                                noOptionsMessage={() => t("noOptionFound")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col">
                      <FormField
                        control={control}
                        name={`items.${index}.permissions`}
                        render={({ field: permsField }) => (
                          <FormItem>
                            <FormLabel>{t("permissions")}</FormLabel>
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                              {ALL_PERMISSIONS.filter((perm) =>
                                permsField.value?.includes("FULLACCESS")
                                  ? perm === "FULLACCESS"
                                  : true,
                              ).map((perm) => {
                                const checked =
                                  permsField.value?.includes(perm);
                                return (
                                  <div
                                    key={perm}
                                    className="flex items-center gap-2"
                                  >
                                    <Checkbox
                                      checked={checked}
                                      onCheckedChange={(isChecked) => {
                                        if (perm === "FULLACCESS") {
                                          if (isChecked) {
                                            permsField.onChange(["FULLACCESS"]);
                                          } else {
                                            permsField.onChange(
                                              permsField.value.filter(
                                                (p: string) =>
                                                  p !== "FULLACCESS",
                                              ),
                                            );
                                          }
                                        } else {
                                          if (isChecked) {
                                            permsField.onChange([
                                              ...permsField.value,
                                              perm,
                                            ]);
                                          } else {
                                            permsField.onChange(
                                              permsField.value.filter(
                                                (p: string) => p !== perm,
                                              ),
                                            );
                                          }
                                        }
                                      }}
                                    />
                                    <label className="text-sm">{perm}</label>
                                  </div>
                                );
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Icon icon="heroicons-outline:trash" />
                        {t("remove")}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ userId: "", permissions: [] })}
            className="mb-4"
          >
            <Icon icon="heroicons-outline:plus" />
            {t("addUser")}
          </Button>

          <div className="flex justify-between w-full pt-5">
            <Button disabled={loading} type="submit">
              {t("save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                router.push(`/projects`);
              }}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ShareProjectForm;
