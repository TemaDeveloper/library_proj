// frontend/src/lib/auth.validation.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "form.error.emailRequired")
    .email("form.error.emailInvalid")
    .max(100, "form.error.emailTooLong"),
  password: z
    .string()
    .min(1, "form.error.passwordRequired")
    .min(6, "form.error.passwordTooShort"),
});

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "form.error.authorNameRequired") 
    .min(2, "form.error.authorNameTooShort") 
    .max(100, "form.error.authorNameTooLong"), 
  email: z
    .string()
    .trim()
    .min(1, "form.error.emailRequired")
    .email("form.error.emailInvalid")
    .max(100, "form.error.emailTooLong"),
  password: z
    .string()
    .min(1, "form.error.passwordRequired")
    .min(6, "form.error.passwordTooShort"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;