/**
 * ============================================================================
 * TEACHING UTILITY: ZOD ERROR FORMATTER
 * ============================================================================
 * 
 * By default, Zod returns errors inside `result.error.issues`, which is an
 * array of issue objects. For example:
 * 
 * [
 *   {
 *     code: "too_small",
 *     path: ["warehouse", "city"],
 *     message: "Warehouse city is required"
 *   }
 * ]
 * 
 * For classroom teaching, we demonstrate two practical formats:
 * 1. Flat Map format: { "name": "...", "warehouse.city": "..." }
 *    - Perfect for EJS templates to display errors directly under each input:
 *      <% if (errors['warehouse.city']) { %> ... <% } %>
 * 
 * 2. API List format: [ { field: "name", message: "..." }, ... ]
 *    - Standardized format commonly used in JSON REST APIs.
 */

/**
 * Converts Zod issues array into a key-value object for form templates.
 * Deep paths like ["warehouse", "city"] become "warehouse.city".
 * 
 * @param {Array} issues - result.error.issues from Zod
 * @returns {Record<string, string>} Form-friendly error object
 */
function formatZodErrorsForForm(issues = []) {
  const errors = {};

  issues.forEach((issue) => {
    // Join nested paths: ["warehouse", "city"] -> "warehouse.city"
    const key = issue.path.join(".");

    // Only keep the first error message per field so UI remains clean
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  });

  return errors;
}

/**
 * Converts Zod issues array into a standardized API error array.
 * 
 * @param {Array} issues - result.error.issues from Zod
 * @returns {Array<{ field: string, message: string, code: string }>}
 */
function formatZodErrorsForApi(issues = []) {
  return issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}

module.exports = {
  formatZodErrorsForForm,
  formatZodErrorsForApi,
};
