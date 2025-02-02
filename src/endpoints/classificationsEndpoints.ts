"use client";

import { useParams } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";
import { EndpointCategory } from "@/components/shared/data-table/api-list";

export const useClassificationEndpoints = (): EndpointCategory[] => {
  const params = useParams();
  const origin = useOrigin();
  const baseUrl = `${origin}/api/${params.projectId}`;

  return [
    {
      category: "Public",
      endpoints: [
        {
          path: `${baseUrl}/categories`,
          description:
            "Use this endpoint for all CRUD operations on users. Specify the HTTP method (GET, POST, PUT, or DELETE) to perform the required action.",
          methods: [
            {
              name: "GET",
              description: "Retrieve all categories",
              example: `curl -X GET "${baseUrl}/categories?page=1&limit=10" \\
  -H "Content-Type: application/json"`,
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
              description: "Retrieve a specific category by ID",
              example: `curl -X GET "${baseUrl}/categories/{categoryId}" \\
  -H "Content-Type: application/json"`,
              parameters: [
                {
                  name: "categoryId",
                  type: "path",
                  description: "The unique identifier of the category",
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
