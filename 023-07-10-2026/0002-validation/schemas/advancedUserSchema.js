const { z } = require("zod");

/**
 * ============================================================================
 * TEACHING MODULE 2: ADVANCED VALIDATION SCHEMA
 * ============================================================================
 * 
 * In this schema, we introduce intermediate-to-advanced Zod capabilities:
 * 1. z.enum()           -> Restricts values to a specific set of allowed strings
 * 2. z.coerce.date()    -> Converts HTML date input string ("YYYY-MM-DD") to Date
 * 3. z.array()          -> Validates lists of items (e.g. skills/checkboxes)
 * 4. .optional()        -> Field is not mandatory
 * 5. .refine()          -> Custom logic and MULTI-FIELD CROSS VALIDATION:
 *                          e.g. password === confirmPassword
 * 6. z.coerce.boolean() -> Converts checkbox values ("on" / undefined) into boolean
 */

const advancedUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must not exceed 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),

    role: z.enum(["user", "editor", "admin"], {
      errorMap: () => ({ message: "Role must be 'user', 'editor', or 'admin'" }),
    }),

    birthDate: z.coerce
      .date({
        errorMap: () => ({ message: "Please provide a valid birth date" }),
      })
      .refine(
        (date) => date < new Date(),
        "Birth date must be in the past"
      ),

    // In HTML forms, empty inputs send "". We handle optional URL or empty string.
    website: z
      .string()
      .trim()
      .url("Please enter a valid URL (e.g., https://example.com)")
      .optional()
      .or(z.literal("")),

    // Express forms send a single string if 1 checkbox is picked, or an array if multiple.
    skills: z.preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z
        .array(z.string())
        .min(1, "Please select at least one skill from the list")
    ),

    // Checkboxes send "on" when checked or undefined when unchecked
    agreeTerms: z.coerce
      .boolean()
      .refine((val) => val === true, "You must accept the terms and conditions"),
  })
  /**
   * CROSS-FIELD VALIDATION WITH .refine():
   * When you need to compare two different fields (e.g., password and confirmPassword),
   * apply .refine() to the parent object.
   * Use `path: ["confirmPassword"]` so the error attaches to the confirmPassword field!
   */
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

module.exports = advancedUserSchema;
