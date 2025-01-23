"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface StepProps {
  number: number;
  text: string;
  active?: boolean;
  size?: number;
}

export function Step({ number, text, active = false, size = 40 }: StepProps) {
  return (
    <div className="flex flex-col items-center" style={{ width: 100 }}>
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold text-sm mb-2 transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground",
        )}
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
        }}
      >
        {number}
      </div>
      <span
        className={cn(
          "text-sm text-center transition-colors overflow-hidden whitespace-nowrap",
          active ? "text-primary font-medium" : "text-muted-foreground",
        )}
        style={{ maxWidth: "100%", textOverflow: "ellipsis" }}
      >
        {text}
      </span>
    </div>
  );
}
