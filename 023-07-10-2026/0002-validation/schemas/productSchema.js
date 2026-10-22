const { z } = require("zod");

/**
 * ============================================================================
 * TEACHING MODULE 3: NESTED OBJECTS & ADVANCED TYPES SCHEMA
 * ============================================================================
 * 
 * In this schema, we introduce:
 * 1. Nested objects (z.object inside z.object)
 * 2. Regular Expressions (.regex) for custom formats like SKU / Postal codes
 * 3. Default values (.default)
 * 4. Array transformations: converting comma-separated strings to string arrays
 * 5. Positive numbers and finite values
 */

const productSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Product title must be at least 3 characters")
    .max(100, "Product title cannot exceed 100 characters"),

  sku: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}-[0-9]{4}$/, "SKU must follow format: ABC-1234 (3 uppercase letters, hyphen, 4 numbers)"),

  category: z.enum(["electronics", "clothing", "books", "groceries"], {
    errorMap: () => ({ message: "Please select a valid product category" }),
  }),

  price: z.coerce
    .number({ invalid_type_error: "Price must be a valid number" })
    .positive("Price must be greater than zero")
    .max(100000, "Price cannot exceed 100,000"),

  discountPercentage: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(90, "Discount cannot exceed 90%")
    .default(0),

  // Supports either array or comma-separated string from text input
  tags: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return val.split(",").map((t) => t.trim()).filter(Boolean);
      }
      return Array.isArray(val) ? val : [];
    },
    z
      .array(z.string().min(2, "Each tag must have at least 2 characters"))
      .min(1, "Please provide at least 1 product tag")
      .max(5, "Maximum 5 tags allowed")
  ),

  inStock: z.coerce
    .boolean()
    .default(true),

  /**
   * NESTED OBJECT VALIDATION:
   * Zod seamlessly validates deeply nested structures.
   * In HTML forms, inputs can be named `warehouse[city]` and `warehouse[aisle]`
   * which Express with `extended: true` automatically nests into `req.body.warehouse`!
   */
  warehouse: z.object({
    city: z
      .string()
      .trim()
      .min(2, "Warehouse city is required (at least 2 characters)"),

    aisle: z.coerce
      .number({ invalid_type_error: "Aisle must be a number" })
      .int("Aisle must be an integer")
      .positive("Aisle number must be greater than 0"),
  }),
});

module.exports = productSchema;
