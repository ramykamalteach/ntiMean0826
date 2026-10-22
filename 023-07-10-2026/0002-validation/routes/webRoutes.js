const express = require("express");
const router = express.Router();

const userSchema = require("../schemas/userSchema");
const advancedUserSchema = require("../schemas/advancedUserSchema");
const productSchema = require("../schemas/productSchema");
const { formatZodErrorsForForm } = require("../utils/formatZodErrors");

/**
 * ============================================================================
 * TEACHING WEB ROUTES: FORM CONTROLLERS WITH SSR (EJS)
 * ============================================================================
 */

// 1. Home / Teaching Dashboard
router.get("/", (req, res) => {
  res.render("index", {
    title: "Node.js + Express Zod Validation Masterclass",
  });
});

// 2. MODULE 1: Basic Registration Form
router.get("/register", (req, res) => {
  res.render("register", {
    title: "Lesson 1: Basic User Registration",
    errors: {},
    oldData: {},
  });
});

router.post("/register", (req, res) => {
  // safeParse() evaluates without throwing exceptions
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    // Extract errors directly as taught in class
    const errors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    });

    // 422 Unprocessable Entity + preserve user inputs with oldData
    return res.status(422).render("register", {
      title: "Lesson 1: Basic User Registration",
      errors,
      oldData: req.body,
    });
  }

  // Validated and coerced data
  const validatedData = result.data;

  res.render("success", {
    title: "Registration Successful!",
    source: "Basic Registration Form",
    data: validatedData,
    rawInput: req.body,
    transformationHighlights: [
      {
        field: "age",
        raw: `"${req.body.age}" (string from form input)`,
        coerced: `${validatedData.age} (coerced number via z.coerce.number())`,
      },
      {
        field: "email",
        raw: `"${req.body.email}"`,
        coerced: `"${validatedData.email}" (trimmed and lowercased)`,
      },
    ],
  });
});

// 3. MODULE 2: Advanced User Registration
router.get("/register-advanced", (req, res) => {
  res.render("register-advanced", {
    title: "Lesson 2: Advanced Validation & Refine",
    errors: {},
    oldData: {},
  });
});

router.post("/register-advanced", (req, res) => {
  const result = advancedUserSchema.safeParse(req.body);

  if (!result.success) {
    const errors = formatZodErrorsForForm(result.error.issues);

    return res.status(422).render("register-advanced", {
      title: "Lesson 2: Advanced Validation & Refine",
      errors,
      oldData: req.body,
    });
  }

  const validatedData = result.data;

  res.render("success", {
    title: "Advanced Profile Created!",
    source: "Advanced Registration Form",
    data: validatedData,
    rawInput: req.body,
    transformationHighlights: [
      {
        field: "confirmPassword",
        raw: "Checked via .refine() cross-field logic",
        coerced: "Matched password perfectly",
      },
      {
        field: "birthDate",
        raw: `"${req.body.birthDate}" (string)`,
        coerced: `${new Date(validatedData.birthDate).toDateString()} (coerced Date instance)`,
      },
      {
        field: "agreeTerms",
        raw: `"${req.body.agreeTerms}" (checkbox "on")`,
        coerced: `${validatedData.agreeTerms} (coerced boolean true)`,
      },
      {
        field: "skills",
        raw: JSON.stringify(req.body.skills),
        coerced: `${JSON.stringify(validatedData.skills)} (array of strings)`,
      },
    ],
  });
});

// 4. MODULE 3: Nested Object Product Form
router.get("/product", (req, res) => {
  res.render("product", {
    title: "Lesson 3: Nested Objects & Regex (Products)",
    errors: {},
    oldData: { warehouse: {} },
  });
});

router.post("/product", (req, res) => {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    const errors = formatZodErrorsForForm(result.error.issues);

    return res.status(422).render("product", {
      title: "Lesson 3: Nested Objects & Regex (Products)",
      errors,
      oldData: req.body || { warehouse: {} },
    });
  }

  const validatedData = result.data;

  res.render("success", {
    title: "Product Successfully Created!",
    source: "Nested Product Form",
    data: validatedData,
    rawInput: req.body,
    transformationHighlights: [
      {
        field: "sku",
        raw: `"${req.body.sku}"`,
        coerced: `"${validatedData.sku}" (validated with custom regex ^[A-Z]{3}-[0-9]{4}$)`,
      },
      {
        field: "tags",
        raw: `"${req.body.tags}" (comma-separated string)`,
        coerced: `${JSON.stringify(validatedData.tags)} (transformed into array)`,
      },
      {
        field: "warehouse.aisle",
        raw: `"${req.body.warehouse?.aisle}" (nested string)`,
        coerced: `${validatedData.warehouse.aisle} (coerced nested integer)`,
      },
    ],
  });
});

// 5. MODULE 4: Interactive API Tester
router.get("/api-tester", (req, res) => {
  res.render("api-tester", {
    title: "Lesson 4: REST API Validation & Live Tester",
  });
});

// 6. MODULE 5: Complete Zod Cheat Sheet
router.get("/cheatsheet", (req, res) => {
  res.render("cheatsheet", {
    title: "Zod Validation Cheat Sheet & Reference",
  });
});

module.exports = router;
