import db from "@/server/db";
import { NextRequest } from "next/server";

export async function checkApiKey(req: NextRequest, projectId: string) {
  try {
    const authHeader = req.headers.get("Authorization");
    let apiKeyFromRequest: string | null = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      apiKeyFromRequest = authHeader.substring("Bearer ".length);
    }

    if (!apiKeyFromRequest) {
      return false;
    }
    const project = await db.project.findFirst({
      where: { id: projectId },
      select: { apiKey: true },
    });

    if (!project || !project.apiKey) {
      return false;
    }
    return apiKeyFromRequest === project.apiKey;
  } catch (error) {
    console.error("[CHECK_API_KEY_ERROR]", error);
    return false;
  }
}
