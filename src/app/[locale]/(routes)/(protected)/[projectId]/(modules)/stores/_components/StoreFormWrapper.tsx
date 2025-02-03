"use client";

import { Store } from "@prisma/client";
import { useTranslations } from "next-intl";
import { storeSchema } from "@/schemas/store.schema";
import { EntityAdminForm } from "@/components/shared/entity/form";
import {
  StoreFormData,
  createStore,
  deleteStore,
  updateStore,
} from "@/actions/stores";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

interface StoreFormProps {
  initData?: Store | null;
}

const StoreFormWrapper: React.FC<StoreFormProps> = ({ initData }) => {
  const t = useTranslations("stores");
  const { toast } = useToast();
  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  const handleSubmit = async (data: StoreFormData) => {
    console.log(data);
    try {
      const finalData = { ...data, projectId };
      const result = data.id
        ? await updateStore(finalData as StoreFormData)
        : await createStore({ ...finalData, projectId: projectId! });

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
      const result = await deleteStore(projectId, id);
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
      entityName="store"
      initData={initData}
      entitySchema={storeSchema(t)}
      entityDefaultValues={{
        id: undefined,
        title: "",
        projectId,
      }}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      className="grid grid-cols-1"
      sections={[
        {
          sectionTitle: "",
          sectionClassName: "grid lg:grid-cols-1 gap-5",
          fields: [
            {
              name: "title",
              label: "title",
              type: "text",
              placeholder: "enterTitle",
              className: "col-span-1",
              sortLevel: 1,
            },
            {
              name: "description",
              label: "description",
              type: "text",
              placeholder: "enterDescription",
              className: "col-span-1",
              sortLevel: 2,
            },
          ],
        },
      ]}
    />
  );
};

export default StoreFormWrapper;
