"use client";

import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface MethodDoc {
  name: string;
  description: string;
  example: string;
  parameters?: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
  }>;
}

export interface EndpointDoc {
  path: string;
  description: string;
  methods: MethodDoc[];
}

export interface EndpointCategory {
  category: string;
  endpoints: EndpointDoc[];
}

export interface ApiListProps {
  endpoints: EndpointCategory[];
  apiKey?: string;
  title?: string;
}

export const ApiList: React.FC<ApiListProps> = ({
  endpoints,
  apiKey,
  title,
}) => {
  const [showApiKey, setShowApiKey] = useState(false);

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${title} Copied`,
      description: `The ${title.toLowerCase()} has been copied to your clipboard.`,
    });
  };

  return (
    <div className="py-4 space-y-4" style={{ direction: "ltr" }}>
      <h1 className="text-xl font-semibold text-center">
        {title || "API Documentation"}
      </h1>

      {apiKey && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>API Key</CardTitle>
            <CardDescription>
              You must include this key in the <code>Authorization</code> header
              as a Bearer token when calling these private APIs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <Input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                readOnly
                className="flex-1 px-4 py-2 font-mono text-sm bg-gray-100 border rounded-lg"
              />
              <Button
                variant="secondary"
                onClick={() => setShowApiKey((prev) => !prev)}
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(apiKey, "API Key")}
              >
                <Copy size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {endpoints.map((category) => (
          <Card key={category.category} className="w-full">
            <CardHeader>
              <CardTitle>{category.category} API</CardTitle>
              <CardDescription>
                List of {category.category.toLowerCase()} API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.endpoints.map((endpoint, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center">
                    <Badge variant="default" className="w-max">
                      CRUD
                    </Badge>
                    <p className="w-full font-mono text-sm break-all sm:w-auto">
                      {endpoint.path}
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(endpoint.path, "Endpoint")}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {endpoint.description}
                  </p>
                  <ul className="space-y-4">
                    {endpoint.methods.map((method, index) => (
                      <li key={index} className="space-y-2">
                        <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center">
                          <Badge
                            variant={
                              method.name === "GET"
                                ? "secondary"
                                : method.name === "DELETE"
                                ? "destructive"
                                : "default"
                            }
                            className="w-max"
                          >
                            {method.name}
                          </Badge>
                          <p className="text-sm font-semibold">
                            {method.description}
                          </p>
                        </div>
                        {method.parameters && method.parameters.length > 0 && (
                          <ul className="ml-4 space-y-1 list-disc list-inside">
                            {method.parameters.map((param) => (
                              <li key={param.name} className="text-sm">
                                <span className="font-mono font-medium">
                                  {param.name}
                                </span>
                                <span className="text-muted-foreground">
                                  {" "}
                                  ({param.type},{" "}
                                  {param.required ? "required" : "optional"})
                                </span>
                                : {param.description}
                              </li>
                            ))}
                          </ul>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="secondary" size="sm">
                              Show Example
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            className="max-w-[700px]"
                            style={{ direction: "ltr" }}
                          >
                            <DialogHeader>
                              <DialogTitle>{method.name} Example</DialogTitle>
                              <DialogDescription>
                                A curl example for {method.name} request method.
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea
                              className="max-w-full min-w-0 p-2 text-sm rounded-md bg-muted"
                              style={{ direction: "ltr" }}
                            >
                              <pre className="break-words whitespace-pre-wrap">
                                {method.example}
                              </pre>
                            </ScrollArea>
                            <DialogFooter>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  copyToClipboard(
                                    method.example,
                                    `${method.name} Example`,
                                  )
                                }
                              >
                                <Copy size={16} />
                                Copy
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
