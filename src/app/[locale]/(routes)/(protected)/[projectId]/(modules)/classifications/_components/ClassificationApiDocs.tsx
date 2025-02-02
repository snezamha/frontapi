"use client";

import { ApiList } from "@/components/shared/data-table/api-list";
import { useClassificationEndpoints } from "@/endpoints/classificationsEndpoints";
import React from "react";

const ClassificationApiDocs = () => {
  const endpoints = useClassificationEndpoints();

  return (
    <ApiList endpoints={endpoints} title="Classifications API Documentation" />
  );
};

export default ClassificationApiDocs;
