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
  apiKey?: string;
}

export const ApiList: React.FC<ApiListProps> = ({
  entityName,
  entityIdName,
  apiKey,
}) => {
  const params = useParams();
  const origin = useOrigin();
  const baseUrl = `${origin}/api/${params.projectId}`;
  const apiEndpoints = [
    {
      category: "Public",
      endpoints: [
        {
          method: "GET",
          path: `${baseUrl}/${entityName}`,
          description: `Retrieve all ${entityName}`,
        },
        {
          method: "GET",
          path: `${baseUrl}/${entityName}/{${entityIdName}}`,
          description: `Retrieve a specific ${entityIdName}`,
        },
      ],
    },
  ];

  const [showApiKey, setShowApiKey] = useState(false);

  const copyToClipboardAPIKey = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "API Key Copied",
      description: "The API key has been copied to your clipboard.",
    });
  };
  const copyToClipboardEndpoint = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Endpoint Copied",
      description: "The endpoint has been copied to your clipboard.",
    });
  };
  return (
    <div className="py-4 space-y-4" style={{ direction: "ltr" }}>
      <h1 className="text-xl font-semibold text-center md:text-left">
        API Endpoints
      </h1>
      {apiKey && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                readOnly
                className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              />
              <div className="flex w-full sm:w-auto space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowApiKey((prev) => !prev)}
                  className="w-full sm:w-auto"
                >
                  {showApiKey ? "Hide" : "Show"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => copyToClipboardAPIKey(apiKey)}
                  className="w-full sm:w-auto"
                >
                  Copy API Key
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        {apiEndpoints.map((category) => (
          <Card key={category.category} className="w-full">
            <CardHeader>
              <CardTitle>{category.category} API</CardTitle>
              <CardDescription>
                List of {category.category.toLowerCase()} API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {category.endpoints.map((endpoint, index) => (
                  <li
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
                  >
                    <Badge
                      variant={
                        endpoint.method === "GET" ? "secondary" : "destructive"
                      }
                      className="mt-1"
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
                      onClick={() => copyToClipboardEndpoint(endpoint.path)}
                    >
                      Copy Endpoint
                    </Button>
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
