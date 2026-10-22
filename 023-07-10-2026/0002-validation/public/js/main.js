/**
 * ============================================================================
 * NTI MEAN STACK: TEACHING HELPERS & INTERACTIVE CLASSROOM SCRIPTS
 * ============================================================================
 */

// 1. QUICK FILL DEMO DATA: BASIC FORM
function fillBasicForm(isValid) {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const ageInput = document.querySelector('input[name="age"]');

  if (!nameInput) return;

  if (isValid) {
    nameInput.value = "Kareem Hassan";
    emailInput.value = "kareem.hassan@example.com";
    passwordInput.value = "Password1234!";
    ageInput.value = "24";
  } else {
    nameInput.value = "Al"; // < 3 chars
    emailInput.value = "invalid-email-format"; // not email
    passwordInput.value = "123"; // < 8 chars
    ageInput.value = "16"; // < 18
  }
}

// 2. QUICK FILL DEMO DATA: ADVANCED FORM
function fillAdvancedForm(isValid) {
  const username = document.querySelector('input[name="username"]');
  const email = document.querySelector('input[name="email"]');
  const password = document.querySelector('input[name="password"]');
  const confirmPassword = document.querySelector('input[name="confirmPassword"]');
  const role = document.querySelector('select[name="role"]');
  const birthDate = document.querySelector('input[name="birthDate"]');
  const website = document.querySelector('input[name="website"]');
  const agreeTerms = document.querySelector('input[name="agreeTerms"]');
  const skillCheckboxes = document.querySelectorAll('input[name="skills"]');

  if (!username) return;

  if (isValid) {
    username.value = "sarah_frontend";
    email.value = "sarah@example.com";
    password.value = "SecurePass123";
    confirmPassword.value = "SecurePass123";
    if (role) role.value = "editor";
    if (birthDate) birthDate.value = "1998-04-15";
    if (website) website.value = "https://portfolio.sarah.dev";
    if (agreeTerms) agreeTerms.checked = true;
    skillCheckboxes.forEach((cb, idx) => {
      cb.checked = idx < 2; // select first two
    });
  } else {
    username.value = "s@rah!"; // invalid chars
    email.value = "sarah-not-an-email";
    password.value = "onlyletters"; // missing number and uppercase
    confirmPassword.value = "doesNotMatch"; // fails .refine()
    if (role) role.value = "user";
    if (birthDate) birthDate.value = "2030-01-01"; // future date
    if (website) website.value = "not-a-valid-url";
    if (agreeTerms) agreeTerms.checked = false; // terms not agreed
    skillCheckboxes.forEach((cb) => (cb.checked = false)); // 0 skills
  }
}

// 3. QUICK FILL DEMO DATA: PRODUCT FORM
function fillProductForm(isValid) {
  const title = document.querySelector('input[name="title"]');
  const sku = document.querySelector('input[name="sku"]');
  const category = document.querySelector('select[name="category"]');
  const price = document.querySelector('input[name="price"]');
  const discount = document.querySelector('input[name="discountPercentage"]');
  const tags = document.querySelector('input[name="tags"]');
  const city = document.querySelector('input[name="warehouse[city]"]');
  const aisle = document.querySelector('input[name="warehouse[aisle]"]');

  if (!title) return;

  if (isValid) {
    title.value = "Dell UltraSharp 27-Inch 4K Monitor";
    sku.value = "MON-4096";
    if (category) category.value = "electronics";
    price.value = "549.99";
    if (discount) discount.value = "10";
    tags.value = "display, 4k, tech, office";
    city.value = "Cairo Logistics Hub";
    aisle.value = "12";
  } else {
    title.value = "TV"; // < 3 chars
    sku.value = "invalid-sku-format"; // regex failure
    if (category) category.value = "electronics";
    price.value = "-15.00"; // not positive
    if (discount) discount.value = "150"; // > 90%
    tags.value = ""; // 0 tags
    city.value = "A"; // < 2 chars
    aisle.value = "-3"; // not positive
  }
}

// 4. INTERACTIVE LIVE API TESTER
async function runApiTest() {
  const schemaType = document.getElementById("apiSchemaSelect")?.value || "basic";
  const jsonInput = document.getElementById("apiJsonInput")?.value;
  const statusBadge = document.getElementById("apiStatusBadge");
  const responseBox = document.getElementById("apiResponseOutput");

  if (!responseBox) return;

  let parsedPayload;
  try {
    parsedPayload = JSON.parse(jsonInput);
  } catch (err) {
    alert("Invalid JSON syntax in request body: " + err.message);
    return;
  }

  statusBadge.innerHTML = `<span style="color: #f59e0b;">⏳ Sending...</span>`;
  responseBox.textContent = "Processing validation on Express server...";

  try {
    const res = await fetch("/api/inspect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        schemaType,
        payload: parsedPayload,
      }),
    });

    const data = await res.json();

    if (res.status === 200) {
      statusBadge.innerHTML = `<span style="color: #10b981; font-weight: bold;">HTTP 200 OK (VALID)</span>`;
    } else if (res.status === 422) {
      statusBadge.innerHTML = `<span style="color: #f43f5e; font-weight: bold;">HTTP 422 Unprocessable Entity (INVALID)</span>`;
    } else {
      statusBadge.innerHTML = `<span style="color: #e2e8f0;">HTTP ${res.status}</span>`;
    }

    responseBox.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    statusBadge.innerHTML = `<span style="color: #f43f5e;">Network Error</span>`;
    responseBox.textContent = "Error communicating with server: " + error.message;
  }
}

// Load Preset Payloads into API Tester
function loadApiPreset(type, isValid) {
  const schemaSelect = document.getElementById("apiSchemaSelect");
  const jsonInput = document.getElementById("apiJsonInput");
  if (!schemaSelect || !jsonInput) return;

  schemaSelect.value = type;

  let payload = {};

  if (type === "basic") {
    payload = isValid
      ? {
          name: "Mohamed Tarek",
          email: "mohamed.tarek@nti.sci.eg",
          password: "StrongPassword2026",
          age: 26,
        }
      : {
          name: "M",
          email: "not-an-email",
          password: "123",
          age: 14,
        };
  } else if (type === "advanced") {
    payload = isValid
      ? {
          username: "mohamed_dev",
          email: "mohamed@example.com",
          password: "SecretPassword1",
          confirmPassword: "SecretPassword1",
          role: "editor",
          birthDate: "1997-08-20",
          website: "https://mohamed.dev",
          skills: ["Node.js", "Express", "MongoDB"],
          agreeTerms: true,
        }
      : {
          username: "user!",
          email: "bad-email",
          password: "SecretPassword1",
          confirmPassword: "MismatchPassword2",
          role: "superadmin",
          birthDate: "2035-01-01",
          website: "bad-url",
          skills: [],
          agreeTerms: false,
        };
  } else if (type === "product") {
    payload = isValid
      ? {
          title: "Sony WH-1000XM5 Wireless Headphones",
          sku: "SNY-5021",
          category: "electronics",
          price: 398.0,
          discountPercentage: 15,
          tags: ["audio", "bluetooth", "noise-canceling"],
          inStock: true,
          warehouse: {
            city: "Alexandria",
            aisle: 8,
          },
        }
      : {
          title: "S",
          sku: "invalid-sku",
          category: "toys",
          price: -10,
          discountPercentage: 99,
          tags: [],
          warehouse: {
            city: "A",
            aisle: 0,
          },
        };
  }

  jsonInput.value = JSON.stringify(payload, null, 2);
}

// Copy to clipboard helper
function copySnippet(text, buttonElement) {
  navigator.clipboard.writeText(text).then(() => {
    const original = buttonElement.textContent;
    buttonElement.textContent = "Copied! ✔";
    setTimeout(() => {
      buttonElement.textContent = original;
    }, 1800);
  });
}
