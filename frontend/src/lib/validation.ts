import { z } from "zod";
import { bookCategory } from "@/types/book";

export const bookFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "form.error.titleRequired")
    .min(2, "form.error.titleTooShort")
    .max(200, "form.error.titleTooLong"),

  description: z
    .string()
    .trim()
    .min(1, "form.error.descriptionRequired")
    .min(10, "form.error.descriptionTooShort")
    .max(1000, "form.error.descriptionTooLong"),

  category: z.nativeEnum(bookCategory, {
    message: "form.error.categoryInvalid",
  }),

  image: z
    .string()
    .url("form.error.imageInvalid")
    .optional()
    .or(z.literal("")), // Allow empty string for optional image

  rating: z
    .number()
    .min(0, "form.error.ratingRange")
    .max(5, "form.error.ratingRange"),

  publicationYear: z
    .union([
      z.number()
        .int({ message: "form.error.publicationYearInt" })
        .min(1950, { message: "form.error.publicationYearMin" })
        .max(new Date().getFullYear(), {
          message: "form.error.publicationYearMax",
        }),
      z.nan()
    ])
    .refine((val) => !isNaN(val), {
      message: "form.error.publicationYearValid",
    }),

  pages: z
    .union([
      z.number()
        .int({ message: "form.error.pagesInt" })
        .min(1, { message: "form.error.pagesMin" }),
      z.nan()
    ])
    .refine((val) => !isNaN(val), {
      message: "form.error.pagesValid",
    }),


  isbn: z
    .string()
    .trim()
    .min(1, "form.error.isbnRequired")
    .max(20, "form.error.isbnTooLong"),

  authorName: z
    .string()
    .trim()
    .min(1, "form.error.authorNameRequired")
    .min(2, "form.error.authorNameTooShort")
    .max(100, "form.error.authorNameTooLong")
    .regex(/^[\p{L}\p{M}\s\.\-']+$/u, "form.error.authorNameInvalid"),
});

export const reviewFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "form.error.nameRequired")
    .min(2, "form.error.nameTooShort")
    .max(100, "form.error.nameTooLong"),
  email: z
    .string()
    .trim()
    .min(1, "form.error.emailRequired")
    .email("form.error.emailInvalid")
    .max(100, "form.error.emailTooLong"),
  content: z
    .string()
    .trim()
    .min(1, "form.error.contentRequired")
    .max(1000, "form.error.contentTooLong"),
});