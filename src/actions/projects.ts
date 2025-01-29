"use server";
import db from "@/server/db";
import { currentUser } from "@/lib/auth";
import { Permission, Project, User, UserProject } from "@prisma/client";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 16);

interface CheckPermissionsResult {
  project: Project & { userProjects: UserProject[] };
  userIsAdmin: boolean;
  userPermissions?: string[];
}

interface ActionResponse {
  success: string;
  error: string;
  project?: Project;
  apiKey?: string;
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

export async function fetchUsers(): Promise<User[]> {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }
  try {
    return await db.user.findMany({
      include: { userProjects: true },
    });
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getAllProjects() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  if (user.role === "ADMIN") {
    return await db.project.findMany({ include: { userProjects: true } });
  } else {
    return await db.project.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          {
            userProjects: {
              some: {
                userId: user.id,
                permissions: {
                  hasSome: ["FULLACCESS", "VIEW"],
                },
              },
            },
          },
        ],
      },
      include: {
        userProjects: {
          include: {
            project: true,
          },
        },
      },
    });
  }
}

export async function getProjectById(projectId: string) {
  const user = await currentUser();
  if (!user) throw new Error("unauthorized");

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      userProjects: true,
    },
  });

  if (
    !project?.userProjects.some((up) => up.userId === user.id) &&
    user.role !== "ADMIN"
  ) {
    return {
      success: "",
      error: "unauthorized",
    };
  }

  return await db.project.findUnique({
    where: { id: projectId },
    include: {
      userProjects: {
        include: {
          project: true,
        },
      },
    },
  });
}

interface CreateProjectInput {
  title: string;
  userProjects?: { userId: string; permissions?: Permission[] }[];
}

export async function createProject(
  data: CreateProjectInput,
): Promise<ActionResponse> {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  if (!data.title?.trim()) {
    throw new Error("Title is required");
  }

  const existingProject = await db.project.findFirst({
    where: {
      title: data.title,
    },
  });

  if (existingProject) {
    return {
      success: "",
      error: "error.project_exists",
    };
  }

  try {
    const userProjectsToCreate =
      data.userProjects?.map((up) => ({
        user: { connect: { id: up.userId } },
        permissions: up.permissions ?? [],
      })) || [];

    const userAlreadyIncluded = userProjectsToCreate.some(
      (item) => item.user.connect.id === user.id,
    );
    if (!userAlreadyIncluded) {
      userProjectsToCreate.push({
        user: { connect: { id: user.id } },
        permissions: ["FULLACCESS"],
      });
    }

    const project = await db.project.create({
      data: {
        title: data.title,
        apiKey: nanoid(),
        owner: { connect: { id: user.id } },
        userProjects: {
          create: userProjectsToCreate,
        },
      },
      include: {
        userProjects: true,
      },
    });

    return {
      success: "projectAddedSuccessfully",
      error: "",
      project,
    };
  } catch (error: unknown) {
    console.error("Error creating project:", error);
    return {
      success: "",
      error: "somethingWentWrong",
    };
  }
}

export async function updateProject({
  parsedInput: data,
}: {
  parsedInput: { id: string; title: string };
}): Promise<ActionResponse> {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  if (!data.id) {
    return {
      success: "",
      error: "Project ID is required",
    };
  }

  let userPermissions;
  let userIsAdmin;

  try {
    ({ userPermissions, userIsAdmin } = await checkUserPermissions(
      data.id,
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

  const canEdit =
    userIsAdmin ||
    userPermissions?.includes("FULLACCESS") ||
    userPermissions?.includes("EDIT");
  if (!canEdit) {
    return { success: "", error: "unauthorized" };
  }

  try {
    await db.project.update({
      where: { id: data.id },
      data: {
        title: data.title,
      },
      include: {
        userProjects: true,
      },
    });
    return {
      success: "projectUpdatedSuccessfully",
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

export async function deleteProject(projectId: string) {
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
    await db.$transaction([
      db.userProject.deleteMany({ where: { projectId } }),
      db.project.delete({ where: { id: projectId } }),
    ]);

    return {
      success: "projectDeletedSuccessfully",
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

interface ShareProjectInput {
  projectId: string;
  items?: { userId: string; permissions: Permission[] }[];
}

export async function shareProject({
  parsedInput: data,
}: {
  parsedInput: ShareProjectInput;
}): Promise<ActionResponse> {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
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

  const canShare = userIsAdmin || userPermissions?.includes("FULLACCESS");
  if (!canShare) {
    return { success: "", error: "unauthorized" };
  }

  try {
    const userProjectsToUpsert = data.items?.map((up) => ({
      where: {
        userId_projectId: {
          userId: up.userId,
          projectId: data.projectId,
        },
      },
      create: {
        userId: up.userId,
        permissions: up.permissions as Permission[],
      },
      update: {
        permissions: up.permissions as Permission[],
      },
    }));

    await db.project.update({
      where: { id: data.projectId },
      data: {
        userProjects: {
          deleteMany: {},
        },
      },
    });

    await db.project.update({
      where: { id: data.projectId },
      data: {
        userProjects: {
          upsert: userProjectsToUpsert,
        },
      },
      include: {
        userProjects: true,
      },
    });
    return {
      success: "projectSharedSuccessfully",
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

export async function getProjectApiKey(
  projectId: string,
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

  const hasAccess = userIsAdmin || userPermissions?.includes("FULLACCESS");
  if (!hasAccess) {
    return { success: "", error: "unauthorized" };
  }

  const project = await db.project.findUnique({
    where: { id: projectId },

    select: { apiKey: true },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return { apiKey: project.apiKey, error: "", success: "" };
}
