"use client";

import { ProjectUser } from "@prisma/client";
import { useTranslations } from "next-intl";
import { userSchema } from "@/schemas/user.schema";
import { EntityAdminForm } from "@/components/shared/entity/form";
import {
  UserFormData,
  createUser,
  deleteUser,
  updateUser,
} from "@/actions/users";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

interface UserFormProps {
  initData?: ProjectUser | null;
}

const UserFormWrapper: React.FC<UserFormProps> = ({ initData }) => {
  const t = useTranslations("users");
  const { toast } = useToast();
  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  const handleSubmit = async (data: UserFormData) => {
    console.log(data);
    try {
      const finalData = { ...data, projectId };
      const result = data.id
        ? await updateUser(finalData as UserFormData)
        : await createUser({ ...finalData, projectId: projectId! });

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
      const result = await deleteUser(projectId, id);
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
      entityName="user"
      initData={initData}
      entitySchema={userSchema(t)}
      entityDefaultValues={{
        id: undefined,
        fullName: null,
        phoneNumber: "",
        projectId,
      }}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      className="grid grid-cols-1"
      sections={[
        {
          sectionTitle: "",
          sectionClassName: "grid lg:grid-cols-2 gap-5",
          fields: [
            {
              name: "fullName",
              label: "fullName",
              type: "text",
              placeholder: "enterFullName",
              className: "col-span-1",
              sortLevel: 1,
            },
            {
              name: "phoneNumber",
              label: "phoneNumber",
              type: "text",
              placeholder: "enterPhoneNumber",
              className: "col-span-1",
              sortLevel: 2,
            },
          ],
        },
      ]}
    />
  );
};

export default UserFormWrapper;
