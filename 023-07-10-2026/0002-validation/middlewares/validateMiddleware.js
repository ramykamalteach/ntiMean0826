const { formatZodErrorsForApi } = require("../utils/formatZodErrors");

/**
 * ============================================================================
 * TEACHING MODULE: REUSABLE EXPRESS VALIDATION MIDDLEWARE
 * ============================================================================
 * 
 * Instead of repeating `schema.safeParse(req.body)` inside every single
 * controller function, professional Express applications use higher-order
 * middleware functions.
 * 
 * Usage in routes:
 *   router.post("/api/users", validateBody(userSchema), userController.create);
 * 
 * Benefits taught to students:
 * 1. DRY (Don't Repeat Yourself) principle
 * 2. Separation of concerns: Validation is decoupled from business logic
 * 3. Automatic data sanitization: replaces req.body with result.data
 *    (stripping unrecognized fields or applying coercion and transforms)
 */

/**
 * Middleware factory for validating req.body against a Zod schema
 * @param {import('zod').ZodSchema} schema 
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errorCount: result.error.issues.length,
        errors: formatZodErrorsForApi(result.error.issues),
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = result.data;
    next();
  };
}

/**
 * Middleware factory for validating query parameters (req.query)
 * Useful for filtering, pagination, and sorting
 * @param {import('zod').ZodSchema} schema 
 */
function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(422).json({
        success: false,
        message: "Query parameter validation failed",
        errors: formatZodErrorsForApi(result.error.issues),
      });
    }

    req.query = result.data;
    next();
  };
}

module.exports = {
  validateBody,
  validateQuery,
};
