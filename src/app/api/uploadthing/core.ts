import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/server/auth";
const f = createUploadthing();
export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "512KB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new UploadThingError("Unauthorized");
      return { userId: session?.user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
  pdfUploader: f({
    pdf: {
      maxFileSize: "1MB",
      maxFileCount: 2,
    },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new UploadThingError("Unauthorized");
      return { userId: session?.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
