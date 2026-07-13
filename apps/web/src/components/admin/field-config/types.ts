import type { z } from "zod";

export interface SelectOption {
  value: string;
  label: string;
}

export type FieldConfig<T> = {
  key: keyof T & string;
  label: string;
  /** Plain-language hint shown under the input. */
  helpText?: string;
  showInTable?: boolean;
} & (
  | { type: "text" | "textarea" }
  | { type: "number" }
  | { type: "date" }
  | { type: "boolean" }
  | { type: "select"; options: SelectOption[] }
  | { type: "image" }
  | { type: "images" }
  | { type: "video" }
);

export interface EntityConfig<T extends { id: string }> {
  name: string;
  pluralName: string;
  apiPath: string;
  adminPath: string;
  fields: FieldConfig<T>[];
  columns: (keyof T & string)[];
  // Loosely typed on purpose: this is a generic admin form driver, and fighting
  // react-hook-form's generic inference against a specific T isn't worth it here.
  schema: z.ZodTypeAny;
  getTitle: (item: T) => string;
  defaultValues: Partial<T>;
}

/** A group of fields with a friendly heading, for the one-page settings forms. */
export interface FieldSection<T> {
  title: string;
  description?: string;
  fields: FieldConfig<T>[];
}
