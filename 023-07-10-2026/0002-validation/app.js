const express = require("express");
const path = require("path");

const webRoutes = require("./routes/webRoutes");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static assets (CSS, JS, icons)
app.use(express.static(path.join(__dirname, "public")));

// Body Parsers:
// 1. urlencoded for traditional HTML Form POST submissions
app.use(express.urlencoded({ extended: true }));
// 2. json for modern REST API JSON requests
app.use(express.json());

// Mount Routes
app.use("/", webRoutes);
app.use("/api", apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render("index", {
    title: "404 - Page Not Found",
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// Start Server (only when run directly)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log("=================================================");
    console.log("🚀 NTI MEAN Stack: Zod Validation Masterclass");
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📚 Basic Form:       http://localhost:${PORT}/register`);
    console.log(`⚡ Advanced Form:    http://localhost:${PORT}/register-advanced`);
    console.log(`📦 Nested Product:   http://localhost:${PORT}/product`);
    console.log(`🧪 API Live Tester:  http://localhost:${PORT}/api-tester`);
    console.log(`📖 Zod Cheat Sheet:  http://localhost:${PORT}/cheatsheet`);
    console.log("=================================================");
  });
}

module.exports = app;
