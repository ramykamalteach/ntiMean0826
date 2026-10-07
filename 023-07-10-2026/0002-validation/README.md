# 🚀 NTI MEAN Stack Diploma: Backend Validation with Zod & Express

Welcome to the **Node.js & Express Backend Data Validation Masterclass** using the **Zod** schema declaration library.

This repository is crafted specifically for instructors to present in the classroom and for students to master robust, production-grade backend data validation.

---

## 📌 Table of Contents
1. [Why Backend Validation Matters](#-why-backend-validation-matters)
2. [3-Hour Course Syllabus & Timeline](#-3-hour-course-syllabus--timeline)
3. [Project Structure](#-project-structure)
4. [Key Concepts Covered](#-key-concepts-covered)
5. [Step-by-Step Teaching Walkthrough](#-step-by-step-teaching-walkthrough)
   - [Lesson 1: Basic Form & Number Coercion](#lesson-1-basic-form--number-coercion)
   - [Lesson 2: Advanced Rules & Cross-Field Refine](#lesson-2-advanced-rules--cross-field-refine)
   - [Lesson 3: Deep Nested Objects & Regex](#lesson-3-deep-nested-objects--regex)
   - [Lesson 4: Reusable REST API Middlewares](#lesson-4-reusable-rest-api-middlewares)
6. [Running the Project](#-running-the-project)
7. [Testing with cURL & Postman](#-testing-with-curl--postman)
8. [Student Homework & Challenges](#-student-homework--challenges)

---

## 🛡️ Why Backend Validation Matters

Frontend validation (HTML5 `required`, Angular reactive forms, React Hook Form) provides great **User Experience (UX)** by giving instant feedback. However, it provides **ZERO reliable security**.

A user can:
- Disable JavaScript in browser settings
- Modify the DOM in DevTools (delete `type="email"`, remove `required`)
- Send HTTP requests directly with **Postman**, **cURL**, or a script
- Bypass frontend restrictions completely

```
Frontend Validation (UX)  +  Backend Validation (Security & Integrity)
                      =  Bulletproof Web Application
```

### Critical Rule for Students
> The backend server **MUST** validate and sanitize all data before:
> - Saving records to MongoDB or SQL databases
> - Creating accounts or hashing passwords
> - Charging credit cards or processing payments
> - Calling third-party APIs

---

## ⏱️ 3-Hour Course Syllabus & Timeline

| Time | Topic | Key Concepts | Hands-on Demo |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:45** | **Core Fundamentals** | `z.object`, `z.string`, `z.number`, `safeParse()`, Form Coercion | `GET /register` & `POST /register` |
| **0:45 - 1:30** | **Error Handling & UX** | Extracting `result.error.issues`, Preserving `oldData`, HTTP 422 | Inline error display in EJS |
| **1:30 - 2:15** | **Advanced Validation** | `z.enum`, `z.coerce.date`, `.refine()` (Confirm Password), Checkboxes | `GET /register-advanced` |
| **2:15 - 2:45** | **Nested Objects & Regex** | Nested `z.object`, SKU regex pattern, Array parsing | `GET /product` |
| **2:45 - 3:00** | **REST API Middlewares** | `validateBody(schema)` middleware, JSON APIs, In-browser tester | `GET /api-tester` |

---

## 📂 Project Structure

```text
0002-validation/
├── app.js                         # Express server configuration & route mounts
├── package.json                   # Dependencies: express, zod, ejs
├── README.md                      # Complete instructor & student lesson guide
├── schemas/
│   ├── userSchema.js              # Lesson 1: Basic registration schema
│   ├── advancedUserSchema.js      # Lesson 2: Passwords match, enums, dates, booleans
│   └── productSchema.js           # Lesson 3: Nested warehouse object, regex SKU, tags
├── middlewares/
│   └── validateMiddleware.js      # Reusable Express validation middleware for REST APIs
├── utils/
│   └── formatZodErrors.js         # Error formatting helpers for EJS forms & JSON APIs
├── routes/
│   ├── webRoutes.js               # EJS form controllers (renders views & oldData)
│   └── apiRoutes.js               # REST API endpoints returning HTTP 422 JSON
├── views/
│   ├── partials/
│   │   ├── header.ejs             # HTML head with modern fonts & stylesheets
│   │   ├── navbar.ejs             # Responsive navigation with badge indicators
│   │   └── footer.ejs             # Course footer and script imports
│   ├── index.ejs                  # Teaching Dashboard & Visual Pipeline Flowchart
│   ├── register.ejs               # Lesson 1: Basic user form with demo fill buttons
│   ├── register-advanced.ejs      # Lesson 2: Advanced form with .refine() password match
│   ├── product.ejs                # Lesson 3: Nested object & SKU regex product form
│   ├── api-tester.ejs             # Lesson 4: In-browser live API JSON tester
│   ├── cheatsheet.ejs             # Comprehensive interactive Zod Cheat Sheet
│   └── success.ejs                # Validated data viewer & type transformation table
└── public/
    ├── css/
    │   └── style.css              # Custom modern UI design system (dark indigo theme)
    └── js/
        └── main.js                # One-click classroom demo presets & API test client
```

---

## 🧠 Key Concepts Covered

### 1. `safeParse()` vs `parse()`
- **`schema.parse(data)`**: Throws an unhandled `ZodError` exception if validation fails. Requires wrapping in `try / catch`.
- **`schema.safeParse(data)`**: Returns a result object without throwing exceptions:
  - When valid: `{ success: true, data: { ... } }`
  - When invalid: `{ success: false, error: ZodError }`

### 2. The HTML Form Coercion Trap (`z.coerce`)
In HTML forms:
```html
<input type="number" name="age" value="25">
```
Express with `express.urlencoded({ extended: true })` parses this as:
```javascript
req.body.age === "25" // STRING, NOT NUMBER!
```
If you declare:
```javascript
age: z.number().min(18) // ❌ FAILS: Expected number, received string
```
The solution is **Type Coercion**:
```javascript
age: z.coerce.number().int().min(18) // ✔ Automatically converts "25" -> 25!
```

### 3. Preserving Submitted Data (`oldData`)
When validation fails, never clear the user's form inputs! We send `req.body` back as `oldData`:
```javascript
return res.status(422).render("register", {
  errors,
  oldData: req.body // Allows <input value="<%= oldData.name || '' %>">
});
```

### 4. HTTP Status Code `422 Unprocessable Entity`
- `400 Bad Request`: Generic client error or malformed JSON syntax.
- `422 Unprocessable Entity`: The server understood the request syntax, but the submitted form or payload failed validation rules.

---

## 📝 Step-by-Step Teaching Walkthrough

### Lesson 1: Basic Form & Number Coercion
File: `schemas/userSchema.js`
```javascript
const { z } = require("zod");

const userSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z.coerce.number().int("Age must be a whole number").min(18, "You must be at least 18 years old")
});

module.exports = userSchema;
```

### Lesson 2: Advanced Rules & Cross-Field Refine
File: `schemas/advancedUserSchema.js`
```javascript
const advancedUserSchema = z.object({
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/, "Alphanumeric only"),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  role: z.enum(["user", "editor", "admin"]),
  birthDate: z.coerce.date().refine(d => d < new Date(), "Must be in the past"),
  agreeTerms: z.coerce.boolean().refine(v => v === true, "Must accept terms")
})
// CROSS-FIELD VALIDATION:
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"] // Attaches error specifically to confirmPassword input
});
```

### Lesson 3: Deep Nested Objects & Regex
File: `schemas/productSchema.js`
```javascript
const productSchema = z.object({
  title: z.string().min(3),
  sku: z.string().regex(/^[A-Z]{3}-[0-9]{4}$/, "Must match ABC-1234"),
  warehouse: z.object({
    city: z.string().min(2),
    aisle: z.coerce.number().int().positive()
  })
});
```

### Lesson 4: Reusable REST API Middlewares
File: `middlewares/validateMiddleware.js`
```javascript
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues
      });
    }

    req.body = result.data; // Replaces req.body with sanitized & coerced data!
    next();
  };
}
```

---

## 🏃 Running the Project

### Prerequisites
- Node.js (version 18+ or 24+)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
# Standard start:
npm start

# Or with Node 24 auto-reload:
npm run dev
```

### 3. Open in Browser
- **Teaching Overview:** [http://localhost:3000](http://localhost:3000)
- **Lesson 1 (Basic Form):** [http://localhost:3000/register](http://localhost:3000/register)
- **Lesson 2 (Advanced Form):** [http://localhost:3000/register-advanced](http://localhost:3000/register-advanced)
- **Lesson 3 (Nested Product):** [http://localhost:3000/product](http://localhost:3000/product)
- **Lesson 4 (Interactive API Tester):** [http://localhost:3000/api-tester](http://localhost:3000/api-tester)
- **Interactive Cheat Sheet:** [http://localhost:3000/cheatsheet](http://localhost:3000/cheatsheet)

---

## 🧪 Testing with cURL & Postman

### Test Invalid Basic User (Expect HTTP 422)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Al",
    "email": "not-an-email",
    "password": "123",
    "age": 15
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errorCount": 4,
  "errors": [
    { "field": "name", "message": "Name must be at least 3 characters", "code": "too_small" },
    { "field": "email", "message": "Please enter a valid email address", "code": "invalid_string" },
    { "field": "password", "message": "Password must be at least 8 characters", "code": "too_small" },
    { "field": "age", "message": "You must be at least 18 years old", "code": "too_small" }
  ]
}
```

### Test Valid Basic User (Expect HTTP 201)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kareem Hassan",
    "email": "kareem@example.com",
    "password": "StrongPassword2026",
    "age": 25
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User successfully registered via API!",
  "receivedData": {
    "name": "Kareem Hassan",
    "email": "kareem@example.com",
    "password": "StrongPassword2026",
    "age": 25
  }
}
```

---

## 🎯 Student Homework & Challenges

1. **Challenge 1: Phone Number Regex**
   Add an optional `phone` field to `userSchema.js` validating Egyptian phone numbers starting with `+20` or `01` followed by 9 digits (e.g. `^(\+201|01)[0-2,5]{1}[0-9]{8}$`).

2. **Challenge 2: Query Parameter Validation**
   Create a route `GET /api/products?page=1&limit=10&search=keyboard` and validate `page` and `limit` using `validateQuery(schema)` with default values.

3. **Challenge 3: Custom Password Strength Rule**
   Use `.refine()` to ensure passwords must not contain the user's name or username.
