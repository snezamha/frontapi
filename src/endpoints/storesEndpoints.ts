"use client";

import { useParams } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";
import { EndpointCategory } from "@/components/shared/data-table/api-list";

export const useStoreEndpoints = (apiKey?: string): EndpointCategory[] => {
  const params = useParams();
  const origin = useOrigin();
  const baseUrl = `${origin}/api/${params.projectId}`;

  return [
    {
      category: "Private",
      endpoints: [
        {
          path: `${baseUrl}/stores`,
          description:
            "Use this endpoint for all CRUD operations on users. Specify the HTTP method (GET, POST, PUT, or DELETE) to perform the required action.",
          methods: [
            {
              name: "GET",
              description: "Retrieve all stores",
              example: `curl -X GET "${baseUrl}/stores?page=1&limit=10" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}"`,
              parameters: [
                {
                  name: "page",
                  type: "query",
                  description: "Page number for pagination",
                  required: false,
                },
                {
                  name: "limit",
                  type: "query",
                  description: "Number of results per page",
                  required: false,
                },
              ],
            },
            {
              name: "GET",
              description: "Retrieve a specific store by ID",
              example: `curl -X GET "${baseUrl}/stores/{storeId}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}"`,
              parameters: [
                {
                  name: "storeId",
                  type: "path",
                  description: "The unique identifier of the store",
                  required: true,
                },
              ],
            },
            {
              name: "POST",
              description: "Create a new store",
              example: `curl -X POST "${baseUrl}/stores" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"title": "", "description": ""}'`,
              parameters: [
                {
                  name: "title",
                  type: "body(JSON)",
                  description: "The store's title.",
                  required: true,
                },
                {
                  name: "description",
                  type: "body(JSON)",
                  description: "The store's description.",
                  required: false,
                },
              ],
            },
            {
              name: "PUT",
              description: "Update an existing store by ID",
              example: `curl -X PUT "${baseUrl}/stores/{storeId}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"title": "", "description": ""}'`,
              parameters: [
                {
                  name: "storeId",
                  type: "path",
                  description: "The unique identifier of the store",
                  required: true,
                },
                {
                  name: "title",
                  type: "body(JSON)",
                  description: "New store title.",
                  required: false,
                },
                {
                  name: "description",
                  type: "body(JSON)",
                  description: "New store description.",
                  required: false,
                },
              ],
            },
            {
              name: "DELETE",
              description: "Delete a store by ID",
              example: `curl -X DELETE "${baseUrl}/stores/{storeId}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}"`,
              parameters: [
                {
                  name: "storeId",
                  type: "path",
                  description: "The unique identifier of the store",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};
