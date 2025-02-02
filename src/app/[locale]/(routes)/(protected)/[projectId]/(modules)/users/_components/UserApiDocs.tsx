"use client";

import { ApiList } from "@/components/shared/data-table/api-list";
import { useUserEndpoints } from "@/endpoints/usersEndpoints";
import React from "react";

interface UserApiDocsProps {
  apiKey?: string;
}

const UserApiDocs: React.FC<UserApiDocsProps> = ({ apiKey }) => {
  const endpoints = useUserEndpoints(apiKey);

  return (
    <ApiList
      endpoints={endpoints}
      apiKey={apiKey}
      title="Users API Documentation"
    />
  );
};

export default UserApiDocs;
