"use client";

import React, { JSX } from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertToSlug } from "@/lib/utils";
import { FileUpload } from "@/components/shared/upload-files";
import { DateTimePicker } from "@/components/ui/date-time-picker";

interface Option {
  value: string | number | null;
  label: string;
  translateOption?: boolean | null;
}

interface BasicFormControl<ValueType = unknown> {
  value: ValueType;
  onChange: (newValue: ValueType) => void;
}

type CustomFieldRenderFn = (props: { field: BasicFormControl }) => JSX.Element;

interface UploadedFile {
  key: string;
  url: string;
  name?: string;
}

export interface FieldDefinition<T> {
  name: keyof T;
  label: string;
  type:
    | "text"
    | "select"
    | "custom"
    | "textarea"
    | "price"
    | "checkbox"
    | "images"
    | "attachments"
    | "date";
  hasSlug?: boolean;
  options?: Option[];
  render?: CustomFieldRenderFn;
  placeholder?: string;
  className?: string;
  sortLevel?: number;
  disabled?: boolean;
}

interface FieldProps<T> {
  fieldDef: FieldDefinition<T>;
  formControl: BasicFormControl;
  t: (key: string) => string;
  tEntityForm: (key: string) => string;
}

export function Field<T extends Record<string, unknown>>({
  fieldDef,
  formControl,
  t,
  tEntityForm,
}: FieldProps<T>) {
  const {
    type,
    label,
    placeholder,
    className,
    hasSlug,
    disabled,
    options,
    render,
  } = fieldDef;
  const value = formControl.value;

  switch (type) {
    case "text":
      return (
        <FormItem className={className}>
          <FormLabel>{t(label)}</FormLabel>
          <FormControl>
            <Input
              placeholder={t(placeholder || "")}
              {...formControl}
              disabled={disabled}
              value={typeof value === "string" ? value : ""}
            />
          </FormControl>
          {hasSlug && (
            <FormDescription>
              <span className="text-xs text-secondary-500">
                {tEntityForm("slug")} {": "}
              </span>
              {typeof value === "string" ? convertToSlug(value) : ""}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      );

    case "price":
      return (
        <FormItem className={className}>
          <FormLabel>{t(label)}</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder={t(placeholder || "")}
              {...formControl}
              disabled={disabled}
              value={
                typeof value === "string" || typeof value === "number"
                  ? value
                  : ""
              }
            />
          </FormControl>
          <FormMessage />
          {isNaN(Number(value)) ? (
            <span className="text-xs text-red-500">
              {t("invalidNumberMessage")}
            </span>
          ) : (
            <span className="mt-1 text-sm text-gray-600">
              {new Intl.NumberFormat().format(Number(value))}
            </span>
          )}
        </FormItem>
      );

    case "select":
      return (
        <FormItem className={className}>
          <FormLabel>{t(label)}</FormLabel>
          <FormControl>
            <Select
              onValueChange={formControl.onChange}
              disabled={disabled}
              value={(value as string) ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder={t(placeholder || "")} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem
                    key={String(option.value ?? "")}
                    value={String(option.value ?? "")}
                  >
                    {option.translateOption ? t(option.label) : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      );

    case "textarea":
      return (
        <FormItem className={className}>
          <FormLabel>{t(label)}</FormLabel>
          <FormControl>
            <Textarea
              className="form-textarea"
              placeholder={t(placeholder || "")}
              {...formControl}
              disabled={disabled}
              value={typeof value === "string" ? value : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      );

    case "custom":
      return (
        <FormItem className={className}>
          <FormLabel>{t(label)}</FormLabel>
          <FormControl>{render && render({ field: formControl })}</FormControl>
          <FormMessage />
        </FormItem>
      );

    case "checkbox":
      return (
        <FormItem className={className}>
          <FormLabel>{t(label)}</FormLabel>
          <FormControl>
            <div
              className={`flex items-center space-x-2 ${
                value
                  ? "cursor-pointer text-green-600"
                  : "cursor-not-allowed text-info"
              }`}
            >
              <Checkbox
                className="flex-none rtl:ml-3"
                checked={Boolean(value)}
                disabled={disabled}
                onCheckedChange={(checked) => formControl.onChange(checked)}
              />
              <div className="text-sm">
                ({value ? tEntityForm("active") : tEntityForm("disabled")})
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      );

    case "images":
      return (
        <FormItem className={className}>
          <FormLabel>{t(label)}</FormLabel>
          <FormControl>
            <FileUpload
              endpoint="imageUploader"
              value={(value as UploadedFile[]) || []}
              onChange={(files) =>
                formControl.onChange([
                  ...((value as UploadedFile[]) || []),
                  ...files,
                ])
              }
              onRemove={(urlToRemove) =>
                formControl.onChange(
                  ((value as UploadedFile[]) || []).filter(
                    (current) => current.url !== urlToRemove,
                  ),
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      );

    case "attachments":
      return (
        <FormItem className={className}>
          <FormLabel>{t(label)}</FormLabel>
          <FormControl>
            <FileUpload
              endpoint="pdfUploader"
              value={(value as UploadedFile[]) || []}
              onChange={(files) =>
                formControl.onChange([
                  ...((value as UploadedFile[]) || []),
                  ...files,
                ])
              }
              onRemove={(urlToRemove) =>
                formControl.onChange(
                  ((value as UploadedFile[]) || []).filter(
                    (current) => current.url !== urlToRemove,
                  ),
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      );

    case "date":
      return (
        <FormItem className={className}>
          <FormLabel>{t(label)}</FormLabel>
          <FormControl>
            <DateTimePicker
              t={t}
              placeholder={placeholder || ""}
              value={
                typeof value === "string" || typeof value === "number"
                  ? new Date(value)
                  : undefined
              }
              onChange={(newDate) => {
                formControl.onChange(newDate?.toISOString() || "");
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      );

    default:
      return null;
  }
}
