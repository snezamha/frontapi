"use client";
import { Loader, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";
import { useForm, SubmitHandler, DefaultValues, Path } from "react-hook-form";
import { JSX } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Field } from "./field";
import { Steps } from "./steps";
import AlertModal from "../modal/alert-modal";
import { useToast } from "@/hooks/use-toast";

interface Section<T> {
  sectionTitle: string;
  sectionClassName: string;
  fields: Array<{
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
    options?: Array<{
      value: string | number | null;
      label: string;
      translateOption?: boolean | null;
    }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (props: any) => JSX.Element;
    placeholder?: string;
    className?: string;
    sortLevel?: number;
    disabled?: boolean;
  }>;
}

interface EntityFormProps<T> {
  basePath?: string;
  entityName: string;
  entitySchema: z.ZodType<T>;
  entityDefaultValues: Partial<T>;
  initData?: T | null;
  onSubmit: (data: T) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  className?: string;
  sections: Array<Section<T>>;
}

export const EntityAdminForm = <T extends Record<string, unknown>>({
  basePath,
  entityName,
  entitySchema,
  entityDefaultValues,
  initData,
  onSubmit,
  onDelete,
  sections,
}: EntityFormProps<T>) => {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const t = useTranslations(`${entityName}s`);
  const tEntityForm = useTranslations("entityForm");
  const router = useRouter();
  const title = initData
    ? t(`edit${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`)
    : t(`add${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`);
  const action = initData ? tEntityForm("saveChanges") : tEntityForm("add");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const defaultValues = initData || entityDefaultValues;
  const form = useForm<z.infer<typeof entitySchema>>({
    resolver: zodResolver(entitySchema),
    defaultValues: defaultValues as DefaultValues<T>,
  });
  const { formState } = form;
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const delta = currentStep - previousStep;
  const initialPosition =
    locale === "fa"
      ? { x: delta > 0 ? "-100%" : "100%", opacity: 0 }
      : { y: delta > 0 ? "100%" : "-100%", opacity: 0 };
  const animatePosition =
    locale === "fa" ? { x: 0, opacity: 1 } : { y: 0, opacity: 1 };
  const steps = sections.map((section, index) => ({
    number: index + 1,
    text: section.sectionTitle ? t(section.sectionTitle) : "",
  }));

  const validateCurrentStepFields = async () => {
    const fields = sections[currentStep].fields.map(
      (field) => field.name as string,
    );
    return form.trigger(fields as Path<T>[], { shouldFocus: true });
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStepFields();
    if (!isValid) {
      toast({
        variant: "destructive",
        description: tEntityForm("pleaseFillAllRequiredFields"),
      });
      return;
    }
    setPreviousStep(currentStep);
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setPreviousStep(currentStep);
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit: SubmitHandler<T> = async (values) => {
    try {
      await onSubmit(values);
      router.push(`${basePath}/${entityName}s`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          tEntityForm("anErrorOccurred") + ": " + (error as Error).message,
      });
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex === currentStep) return;
    if (stepIndex > currentStep) {
      const isValid = await validateCurrentStepFields();
      if (!isValid) {
        toast({
          variant: "destructive",
          description: tEntityForm("pleaseFillAllRequiredFields"),
        });
        return;
      }
    }
    setPreviousStep(currentStep);
    setCurrentStep(stepIndex);
  };
  const handleDelete = async () => {
    if (!onDelete || !initData || typeof initData.id !== "string") {
      toast({
        variant: "destructive",
        description: tEntityForm("somethingWentWrong"),
      });
      return;
    }
    setLoading(true);
    try {
      await onDelete(initData.id);
      router.push(`${basePath}/${entityName}s`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          tEntityForm("anErrorOccurred") + ": " + (error as Error).message,
      });
    } finally {
      setOpen(false);
    }
  };
  return (
    <>
      <CardHeader className="border-0 border-b border-default-200 border-solid">
        <CardTitle className="text-default-900 font-medium">
          <div className="flex items-center justify-between">
            {title}
            {onDelete && initData && (
              <>
                <AlertModal
                  isOpen={open}
                  onClose={() => setOpen(false)}
                  onConfirm={handleDelete}
                  loading={loading}
                />
                <Button
                  onClick={() => setOpen(true)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                  {tEntityForm("delete")}
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <CardContent className="p-6">
          <Steps
            steps={steps}
            currentStep={currentStep}
            size={35}
            onStepClick={handleStepClick}
          />
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.sectionTitle}
              initial={initialPosition}
              animate={animatePosition}
              transition={{ duration: 0.3 }}
              className={sectionIndex === currentStep ? "block" : "hidden"}
            >
              <form
                onSubmit={form.handleSubmit(handleFinalSubmit)}
                className="space-y-8 w-full"
              >
                <div className={sections[currentStep].sectionClassName}>
                  {section.sectionTitle && (
                    <h2 className="col-span-full text-lg font-semibold text-gray-700">
                      {t(section.sectionTitle)}
                    </h2>
                  )}
                  {sections[currentStep].fields
                    ?.sort((a, b) => (a.sortLevel ?? 0) - (b.sortLevel ?? 0))
                    .map((fieldDef) => (
                      <FormField
                        key={fieldDef.name.toString()}
                        control={form.control}
                        name={fieldDef.name as Path<T>}
                        render={({ field: formField }) => (
                          <Field
                            fieldDef={fieldDef}
                            formControl={formField}
                            t={t}
                            tEntityForm={tEntityForm}
                          />
                        )}
                      />
                    ))}
                </div>
                <div className="flex justify-between">
                  {sectionIndex === sections.length - 1 ? (
                    <Button type="submit" disabled={formState.isSubmitting}>
                      {formState.isSubmitting ? (
                        <>
                          <span className="rounded-full animate-spin">
                            <Loader className="h-5 w-5" />
                          </span>
                          {tEntityForm("applying")}
                        </>
                      ) : (
                        action
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary"
                    >
                      {tEntityForm("next")}
                    </Button>
                  )}
                  {sectionIndex > 0 ? (
                    <Button
                      type="button"
                      onClick={handlePrev}
                      className="btn-secondary"
                    >
                      {tEntityForm("previous")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`${basePath}/${entityName}s`)}
                    >
                      {tEntityForm("cancel")}
                    </Button>
                  )}
                </div>
              </form>
            </motion.div>
          ))}
        </CardContent>
      </Form>
    </>
  );
};
