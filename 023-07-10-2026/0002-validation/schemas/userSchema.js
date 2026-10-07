const { z } = require("zod");

/**
 * ============================================================================
 * TEACHING MODULE 1: BASIC USER VALIDATION SCHEMA
 * ============================================================================
 * 
 * In this schema, we introduce the essential building blocks of Zod:
 * 1. z.object()       -> Defines a schema for an object structure
 * 2. z.string()       -> Validates that a property is of type string
 * 3. .min(n, msg)     -> Enforces minimum character length with a custom message
 * 4. .email(msg)      -> Validates email format using regex internally
 * 5. z.coerce.number()-> KEY POINT FOR FORMS: Converts incoming string "25" into 25
 * 6. .int(msg)        -> Disallows decimal numbers (e.g. 25.5 is invalid)
 */

const userSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters"),

  /**
   * CRITICAL TEACHING NOTE:
   * When an HTML form submits <input type="number" name="age" value="25">,
   * Express parses req.body.age as the STRING "25".
   * 
   * If you use z.number(), validation will FAIL because typeof "25" === "string".
   * 
   * z.coerce.number() instructs Zod to automatically run Number(val) before
   * validating, cleanly converting "25" into the integer 25!
   */
  age: z.coerce
    .number({
      invalid_type_error: "Age must be a valid number",
    })
    .int("Age must be a whole number")
    .min(18, "You must be at least 18 years old")
    .max(120, "Age cannot exceed 120 years"),
});

module.exports = userSchema;
