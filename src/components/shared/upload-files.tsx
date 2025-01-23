"use client";

import { File, Trash } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@uploadthing/react";
import deleteFiles from "./delete-files";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { OurFileRouter } from "@/app/api/uploadthing/core";

interface UploadFileResponse {
  key: string;
  url: string;
  name?: string;
}

interface FileUploadProps {
  onChange: (value: UploadFileResponse[]) => void;
  onRemove: (value: string) => void;
  value?: UploadFileResponse[];
  endpoint: "imageUploader" | "pdfUploader";
}

export const FileUpload = ({
  onChange,
  onRemove,
  value,
  endpoint,
}: FileUploadProps) => {
  const { toast } = useToast();

  return (
    <>
      {value ? (
        <div className="pb-5 flex flex-wrap gap-4">
          {value.map((item, index) => (
            <div
              key={`${item.key}-${index}`}
              className="relative h-[200px] w-[200px] rounded-md overflow-hidden bg-gray-50 border border-gray-200 dark:bg-zinc-800"
            >
              <div className="absolute right-2 top-2 z-10">
                <Button
                  type="button"
                  onClick={async () => {
                    onRemove(item.url);
                    await deleteFiles(item.key);
                  }}
                  color="destructive"
                  variant="default"
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              {item.url && endpoint === "imageUploader" ? (
                <Image
                  src={item.url}
                  alt={item.name ?? "Image"}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 200px"
                  className="object-cover rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <File className="h-8 w-8 text-gray-500 mb-2" />
                  {item.name && (
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 break-all">
                      {item.name}
                    </span>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-sm text-blue-600 underline"
                    >
                      Open
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
      <UploadDropzone<OurFileRouter, "imageUploader" | "pdfUploader">
        className="ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300 py-2 dark:bg-zinc-800"
        endpoint={endpoint}
        config={{ mode: "auto" }}
        onClientUploadComplete={(res?: UploadFileResponse[]) => {
          if (res) {
            onChange(res);
          }
        }}
        onUploadError={(error: Error) => {
          toast({
            variant: "destructive",
            description: `ERROR! ${error.message}`,
          });
        }}
      />
    </>
  );
};
