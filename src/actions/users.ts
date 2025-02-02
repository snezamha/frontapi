"use server";
import db from "@/server/db";
import { currentUser } from "@/lib/auth";
import { Project, UserProject } from "@prisma/client";

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

export async function getAllUsers(projectId: string) {
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
    const users = await db.projectUser.findMany({
      where: {
        projectId,
      },
      include: {
        project: true,
      },
    });
    return users.map((user) => ({
      ...user,
    }));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch users");
  }
}

export async function getUserById(projectId: string, userId: string) {
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
    const user = await db.projectUser.findUnique({
      where: {
        id: userId,
        projectId,
      },
      include: {
        project: true,
      },
    });
    return user || null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user");
  }
}

export interface UserFormData {
  id?: string;
  fullName?: string | null;
  phoneNumber: string;
  otpCode?: string | null;
  otpExpiresIn?: Date | null;
  projectId: string;
}

export async function createUser(data: UserFormData): Promise<ActionResponse> {
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
    await db.projectUser.create({
      data: {
        phoneNumber: data.phoneNumber,
        fullName: data.fullName || null,
        otpCode: null,
        otpExpiresIn: null,
        projectId: data.projectId,
      },
    });

    return {
      success: "userAddedSuccessfully",
      error: "",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }
}

export async function updateUser(data: UserFormData): Promise<ActionResponse> {
  if (!data.id) {
    return { success: "", error: "userIdNotProvided" };
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
    await db.projectUser.update({
      where: { id: data.id },
      data: {
        phoneNumber: data.phoneNumber,
        fullName: data.fullName || null,
        otpCode: data.otpCode || null,
        otpExpiresIn: data.otpExpiresIn || null,
        projectId: data.projectId,
      },
    });

    return {
      success: "userUpdatedSuccessfully",
      error: "",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }
}

export async function deleteUser(
  projectId: string,
  userId: string,
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
    await db.projectUser.delete({
      where: { id: userId },
    });
    return {
      success: "userDeletedSuccessfully",
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
