"use client";

import { ApiList } from "@/components/shared/data-table/api-list";
import { useStoreEndpoints } from "@/endpoints/storesEndpoints";
import React from "react";

interface StoreApiDocsProps {
  apiKey?: string;
}

const StoreApiDocs: React.FC<StoreApiDocsProps> = ({ apiKey }) => {
  const endpoints = useStoreEndpoints(apiKey);

  return (
    <ApiList
      endpoints={endpoints}
      apiKey={apiKey}
      title="Stores API Documentation"
    />
  );
};

export default StoreApiDocs;
