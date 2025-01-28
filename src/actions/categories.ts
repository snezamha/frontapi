"use server";
import db from "@/server/db";
import { currentUser } from "@/lib/auth";
import { Project, UserProject } from "@prisma/client";
import { convertToSlug } from "@/lib/utils";

interface CheckPermissionsResult {
  project: Project & { userProjects: UserProject[] };
  userIsAdmin: boolean;
  userPermissions?: string[];
}

interface ActionResponse {
  success: string;
  error: string;
  project?: Project;
}

export async function checkUserPermissions(
  projectId: string,
  userId: string,
  userRole: string,
): Promise<CheckPermissionsResult> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      userProjects: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const userIsProjectOwner = project.userProjects.some(
    (up) => up.userId === userId,
  );
  const userIsAdmin = userRole === "ADMIN";

  if (!userIsProjectOwner && !userIsAdmin) {
    throw new Error("unauthorized");
  }

  const userPermissions = project.userProjects.find(
    (up) => up.userId === userId,
  )?.permissions;

  return {
    project,
    userIsAdmin,
    userPermissions,
  };
}

export async function getAllCategories(projectId: string) {
  const user = await currentUser();
  if (!user) {
    return {
      success: "",
      error: "Unauthorized: User not authenticated",
    };
  }

  let userPermissions;
  let userIsAdmin;

  try {
    ({ userPermissions, userIsAdmin } = await checkUserPermissions(
      projectId,
      user.id,
      user.role,
    ));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }
  const canView =
    userIsAdmin ||
    userPermissions?.includes("FULLACCESS") ||
    userPermissions?.includes("VIEW");

  if (!canView) {
    return { success: "", error: "unauthorized" };
  }
  try {
    const categories = await db.categories.findMany({
      where: {
        projectId,
      },
      include: {
        parent: true,
      },
    });
    return categories.map((category) => ({
      ...category,
    }));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch categories");
  }
}

export async function getCategory(projectId: string, categoryId: string) {
  const user = await currentUser();
  if (!user) {
    return {
      success: "",
      error: "Unauthorized: User not authenticated",
    };
  }

  let userPermissions;
  let userIsAdmin;

  try {
    ({ userPermissions, userIsAdmin } = await checkUserPermissions(
      projectId,
      user.id,
      user.role,
    ));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }
  const canView =
    userIsAdmin ||
    userPermissions?.includes("FULLACCESS") ||
    userPermissions?.includes("VIEW");

  if (!canView) {
    return { success: "", error: "unauthorized" };
  }
  try {
    const category = await db.categories.findUnique({
      where: {
        id: categoryId,
        projectId,
      },
      include: {
        parent: true,
      },
    });
    return category || null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch categories");
  }
}

interface CategoryFormData {
  id?: string;
  title?: string;
  slug?: string | null;
  parentId?: string | null;
  type: string;
  projectId: string;
}

export async function createCategory(
  data: CategoryFormData,
): Promise<ActionResponse> {
  const user = await currentUser();
  if (!user) {
    return {
      success: "",
      error: "Unauthorized: User not authenticated",
    };
  }

  let userPermissions;
  let userIsAdmin;

  try {
    ({ userPermissions, userIsAdmin } = await checkUserPermissions(
      data.projectId,
      user.id,
      user.role,
    ));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }

  const canCreate =
    userIsAdmin ||
    userPermissions?.includes("FULLACCESS") ||
    userPermissions?.includes("ADD");

  if (!canCreate) {
    return { success: "", error: "unauthorized" };
  }

  try {
    await db.categories.create({
      data: {
        title: data.title?.trim() || "",
        slug: convertToSlug(data.title?.trim() || ""),
        parentId: data.parentId === "null" ? null : data.parentId,
        type: data.type,
        projectId: data.projectId,
      },
    });

    return {
      success: "categoryAddedSuccessfully",
      error: "",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }
}

export async function updateCategory(
  data: CategoryFormData,
): Promise<ActionResponse> {
  if (!data.id) {
    return { success: "", error: "categoryIdNotProvided" };
  }

  const user = await currentUser();
  if (!user) {
    return {
      success: "",
      error: "Unauthorized: User not authenticated",
    };
  }

  let userPermissions;
  let userIsAdmin;

  try {
    ({ userPermissions, userIsAdmin } = await checkUserPermissions(
      data.projectId,
      user.id,
      user.role,
    ));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }

  const canEdit =
    userIsAdmin ||
    userPermissions?.includes("FULLACCESS") ||
    userPermissions?.includes("EDIT");

  if (!canEdit) {
    return { success: "", error: "unauthorized" };
  }

  try {
    await db.categories.update({
      where: { id: data.id },
      data: {
        title: data.title?.trim(),
        slug: convertToSlug(data.title?.trim() || ""),
        parentId: data.parentId === "null" ? null : data.parentId,
        type: data.type,
      },
    });

    return {
      success: "categoryUpdatedSuccessfully",
      error: "",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }
}

export async function deleteCategory(
  projectId: string,
  categoryId: string,
): Promise<ActionResponse> {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  let userPermissions;
  let userIsAdmin;

  try {
    ({ userPermissions, userIsAdmin } = await checkUserPermissions(
      projectId,
      user.id,
      user.role,
    ));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: "",
        error: error.message,
      };
    }
    return {
      success: "",
      error: "somethingWentWrong",
    };
  }

  const canDelete =
    userIsAdmin ||
    userPermissions?.includes("FULLACCESS") ||
    userPermissions?.includes("DELETE");
  if (!canDelete) {
    return { success: "", error: "unauthorized" };
  }

  try {
    await db.categories.delete({
      where: { id: categoryId },
    });
    return {
      success: "categoryDeletedSuccessfully",
      error: "",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: "",
        error: error.message,
      };
    }
    return {
      success: "",
      error: "somethingWentWrong",
    };
  }
}
