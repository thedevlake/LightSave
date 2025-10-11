import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import setupApp from "./app.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Define allowed origins
const allowedOrigins = [
  "https://lightsave.netlify.app",
  "http://localhost:5173",
];

// ✅ Set up CORS correctly
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Parse JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.json({
    message: "Lightsave backend is running successfully 🚀",
    status: "ok",
  });
});

// ✅ Mount app routes
setupApp(app);

// ✅ Catch all 404 routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Accessible at: https://lightsave.onrender.com`);
});
