import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stubApi, currentUser } from "./stub-api.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve /public relative to THIS file, not to whatever folder the host starts
// the process from. With a relative "public", a host that runs `node server.js`
// from another directory can't find the files, answers every request with an
// HTML 404 page, and the browser refuses it:
//   "Expected a JavaScript module script but the server responded with a MIME
//    type of text/html"
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "public");

// Belt and braces: state the content types the game depends on explicitly.
const TYPES = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    // Set SESSION_SECRET on Render; the fallback is only for local testing.
    secret: process.env.SESSION_SECRET || "dev-only-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  })
);

app.use(stubApi);

app.get("/login", (req, res) => {
  if (currentUser(req)) return res.redirect("/");
  res.sendFile(path.join(PUBLIC_DIR, "login.html"));
});

// Files the login page itself needs must be listed here, or it can't load them.
const OPEN_PATHS = new Set(["/login.html", "/style.css"]);

app.use((req, res, next) => {
  if (currentUser(req) || OPEN_PATHS.has(req.path)) return next();
  if (req.path.startsWith("/api/")) {
    return res.status(401).json({ error: "Not logged in." });
  }
  res.redirect("/login");
});

app.use(
  express.static(PUBLIC_DIR, {
    setHeaders(res, filePath) {
      const type = TYPES[path.extname(filePath).toLowerCase()];
      if (type) res.setHeader("Content-Type", type);
    },
  })
);

// Temporary: until the game-select page exists, send the home page to the game.
app.get("/", (req, res) => {
  res.redirect("/games/galaxy-attackers/");
});

// A missing .js/.css/.mp3 should fail loudly as a plain 404, not come back as HTML.
app.use((req, res) => {
  res.status(404).type("text/plain").send(`Not found: ${req.path}`);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});