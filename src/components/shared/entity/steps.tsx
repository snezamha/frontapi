"use client";
import React from "react";
import { Step } from "./step";

interface StepsProps {
  steps: Array<{ number: number; text: string }>;
  currentStep: number;
  size?: number;
  onStepClick?: (stepIndex: number) => void;
}

export function Steps({ steps, currentStep, size, onStepClick }: StepsProps) {
  if (steps.length <= 1) return null;

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-center gap-8 mb-6">
        {steps.map((step, index) => (
          <div
            key={step.number}
            onClick={() => onStepClick && onStepClick(index)}
            className="cursor-pointer"
          >
            <Step
              number={step.number}
              text={step.text}
              active={step.number === currentStep + 1}
              size={size}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
