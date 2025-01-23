"use client";

import React from "react";
import { EntityAdminForm } from "@/components/shared/entity/form";
import { projectSchema } from "@/schemas/project.schema";
import { Project } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

import {
  deleteProject,
  createProject,
  updateProject,
} from "@/actions/projects";

interface ProjectFormProps {
  initData?: Project | null;
}

interface ProjectFormData {
  id?: string;
  title: string | null;
}

const ProjectFormWrapper: React.FC<ProjectFormProps> = ({ initData }) => {
  const t = useTranslations("projects");
  const { toast } = useToast();

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      const result = data.id
        ? await updateProject({
            parsedInput: { id: data.id, title: data.title ?? "" },
          })
        : await createProject({
            title: data.title ?? "",
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
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred: " + (error as Error).message,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteProject(id);
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
      entityName="project"
      initData={initData}
      entitySchema={projectSchema(t)}
      entityDefaultValues={{
        id: "",
        title: "",
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
              name: "title",
              label: "title",
              type: "text",
              placeholder: "enterTitle",
              className: "col-span-1",
              sortLevel: 1,
            },
          ],
        },
      ]}
    />
  );
};

export default ProjectFormWrapper;
