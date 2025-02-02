"use client";

import { useParams } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
  apiKey?: string; // If you want to display an API key
}

export const ApiList: React.FC<ApiListProps> = ({
  entityName,
  entityIdName,
  apiKey,
}) => {
  const params = useParams();
  const origin = useOrigin();
  const baseUrl = `${origin}/api/${params.projectId}`;

  // Example: 'categories' => /api/{projectId}/categories, {categoryId}
  // We'll separate GET requests (Public) from POST/PUT/DELETE (Admin).

  const apiEndpoints = [
    {
      category: "Public",
      endpoints: [
        {
          method: "GET",
          path: `${baseUrl}/${entityName}?page=1&limit=10`,
          description: `Get a paginated list of ${entityName}`,
          example: `
curl -X GET "${baseUrl}/${entityName}?page=1&limit=10"
          `,
        },
        {
          method: "GET",
          path: `${baseUrl}/${entityName}/{${entityIdName}}`,
          description: `Retrieve a specific ${entityName.slice(0, -1)}`,
          example: `
curl -X GET "${baseUrl}/${entityName}/123"
          `,
        },
      ],
    },
    {
      category: "Admin",
      endpoints: [
        {
          method: "POST",
          path: `${baseUrl}/${entityName}`,
          description: `Create a new ${entityName.slice(0, -1)}`,
          example: `
curl -X POST "${baseUrl}/${entityName}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -d '{
    "title": "Example Category",
    "slug": "example-category",
    "type": "main",
    "parentId": null
  }'
          `,
        },
        {
          method: "PUT",
          path: `${baseUrl}/${entityName}/{${entityIdName}}`,
          description: "Update category details",
          example: `
curl -X PUT "${baseUrl}/${entityName}/123" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -d '{
    "title": "Updated Title"
  }'
          `,
        },
        {
          method: "DELETE",
          path: `${baseUrl}/${entityName}/{${entityIdName}}`,
          description: "Delete a category",
          example: `
curl -X DELETE "${baseUrl}/${entityName}/123" \\
  -H "Authorization: Bearer <YOUR_API_KEY>"
          `,
        },
      ],
    },
  ];

  const [showApiKey, setShowApiKey] = useState(false);

  // Helper to copy text to clipboard and show a toast notification
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} Copied`,
      description: `${label} has been copied to your clipboard.`,
    });
  };

  return (
    <div className="py-4 space-y-4" style={{ direction: "ltr" }}>
      <h1 className="text-xl font-semibold text-center md:text-left">
        Categories API Documentation
      </h1>

      {/* If you want to display an API key to the user */}
      {apiKey && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>API Key</CardTitle>
            <CardDescription>
              For admin endpoints, include this key in the{" "}
              <code>Authorization</code> header as a Bearer token.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                readOnly
                className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowApiKey((prev) => !prev)}
                >
                  {showApiKey ? "Hide" : "Show"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => copyToClipboard(apiKey, "API Key")}
                >
                  Copy API Key
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Display Public and Admin endpoints */}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {apiEndpoints.map((group) => (
          <Card key={group.category} className="w-full">
            <CardHeader>
              <CardTitle>{group.category} API</CardTitle>
              <CardDescription>
                {group.category === "Public"
                  ? "No authentication required for GET requests"
                  : "Requires API Key for admin operations"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {group.endpoints.map((endpoint, index) => (
                  <li key={index} className="space-y-2">
                    {/* Endpoint Basic Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                      <Badge
                        variant={
                          endpoint.method === "GET"
                            ? "secondary"
                            : endpoint.method === "DELETE"
                            ? "destructive"
                            : "default"
                        }
                        className="mt-1 w-max"
                      >
                        {endpoint.method}
                      </Badge>
                      <div className="w-full">
                        <p className="font-mono text-sm break-all">
                          {endpoint.path}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {endpoint.description}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-min"
                        onClick={() =>
                          copyToClipboard(endpoint.path, "Endpoint")
                        }
                      >
                        Copy Endpoint
                      </Button>
                    </div>

                    {/* Example usage */}
                    {endpoint.example && (
                      <div className="mt-2 ml-2">
                        <p className="font-semibold">Example:</p>
                        <pre className="bg-muted p-2 rounded-md text-sm">
                          {endpoint.example.trim()}
                        </pre>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            copyToClipboard(
                              endpoint.example as string,
                              "Example",
                            )
                          }
                        >
                          Copy Example
                        </Button>
                      </div>
                    )}

                    {/* Divider between endpoints */}
                    {index < group.endpoints.length - 1 && (
                      <hr className="my-4" />
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
