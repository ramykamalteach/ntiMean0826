const express = require("express");
const router = express.Router();

const userSchema = require("../schemas/userSchema");
const advancedUserSchema = require("../schemas/advancedUserSchema");
const productSchema = require("../schemas/productSchema");
const { validateBody } = require("../middlewares/validateMiddleware");
const { formatZodErrorsForApi } = require("../utils/formatZodErrors");

/**
 * ============================================================================
 * REST API ROUTES DEMONSTRATING ZOD VALIDATION MIDDLEWARE
 * ============================================================================
 */

// 1. Basic User API Endpoint
router.post("/users", validateBody(userSchema), (req, res) => {
  res.status(201).json({
    success: true,
    message: "User successfully registered via API!",
    receivedData: req.body,
    notes: {
      ageType: typeof req.body.age,
      isNumber: Number.isInteger(req.body.age),
    },
  });
});

// 2. Advanced User API Endpoint
router.post("/users/advanced", validateBody(advancedUserSchema), (req, res) => {
  res.status(201).json({
    success: true,
    message: "Advanced user profile successfully registered!",
    receivedData: req.body,
  });
});

// 3. Product API Endpoint (with Nested Objects)
router.post("/products", validateBody(productSchema), (req, res) => {
  res.status(201).json({
    success: true,
    message: "Product successfully created with nested warehouse details!",
    receivedData: req.body,
  });
});

// 4. Live Schema Inspector (Used by the Interactive Live Tester in the UI)
router.post("/inspect", (req, res) => {
  const { schemaType, payload } = req.body;

  let selectedSchema;
  let schemaName;

  switch (schemaType) {
    case "advanced":
      selectedSchema = advancedUserSchema;
      schemaName = "Advanced User Schema";
      break;
    case "product":
      selectedSchema = productSchema;
      schemaName = "Product & Warehouse Schema";
      break;
    case "basic":
    default:
      selectedSchema = userSchema;
      schemaName = "Basic User Schema";
      break;
  }

  const result = selectedSchema.safeParse(payload);

  if (result.success) {
    return res.json({
      success: true,
      schemaName,
      data: result.data,
      dataTypes: Object.fromEntries(
        Object.entries(result.data).map(([k, v]) => [k, Array.isArray(v) ? "array" : typeof v])
      ),
    });
  } else {
    return res.status(422).json({
      success: false,
      schemaName,
      rawIssues: result.error.issues,
      formattedErrors: formatZodErrorsForApi(result.error.issues),
    });
  }
});

module.exports = router;
