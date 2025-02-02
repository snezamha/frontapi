"use client";

import { useParams } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";
import { EndpointCategory } from "@/components/shared/data-table/api-list";

export const useUserEndpoints = (apiKey?: string): EndpointCategory[] => {
  const params = useParams();
  const origin = useOrigin();
  const baseUrl = `${origin}/api/${params.projectId}`;

  if (!apiKey) {
    return [
      {
        category: "Public",
        endpoints: [
          {
            path: `${baseUrl}/users`,
            description:
              "But there is no public access to this module!",
            methods: [],
          },
        ],
      },
    ];
  }

  return [
    {
      category: "Private",
      endpoints: [
        {
          path: `${baseUrl}/users`,
          description:
            "Use this endpoint for all CRUD operations on users. Specify the HTTP method (GET, POST, PUT, or DELETE) to perform the required action.",
          methods: [
            {
              name: "GET",
              description: "Retrieve all users",
              example: `curl -X GET "${baseUrl}/users?page=1&limit=10" \\
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
              description: "Retrieve a specific user by ID",
              example: `curl -X GET "${baseUrl}/users/{userId}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}"`,
              parameters: [
                {
                  name: "userId",
                  type: "path",
                  description: "The unique identifier of the user",
                  required: true,
                },
              ],
            },
            {
              name: "POST",
              description: "Create a new user",
              example: `curl -X POST "${baseUrl}/users" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"phoneNumber": "09999999999", "fullName": "John Doe"}'`,
              parameters: [
                {
                  name: "phoneNumber",
                  type: "body(JSON)",
                  description: "The user's phone number.",
                  required: true,
                },
                {
                  name: "fullName",
                  type: "body(JSON)",
                  description: "The user's full name.",
                  required: false,
                },
              ],
            },
            {
              name: "PUT",
              description: "Update an existing user by ID",
              example: `curl -X PUT "${baseUrl}/users/{userId}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"phoneNumber": "09999999999", "fullName": "Jane Doe"}'`,
              parameters: [
                {
                  name: "userId",
                  type: "path",
                  description: "The unique identifier of the user",
                  required: true,
                },
                {
                  name: "phoneNumber",
                  type: "body(JSON)",
                  description: "New phone number.",
                  required: false,
                },
                {
                  name: "fullName",
                  type: "body(JSON)",
                  description: "New full name.",
                  required: false,
                },
              ],
            },
            {
              name: "DELETE",
              description: "Delete a user by ID",
              example: `curl -X DELETE "${baseUrl}/users/{userId}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}"`,
              parameters: [
                {
                  name: "userId",
                  type: "path",
                  description: "The unique identifier of the user",
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
