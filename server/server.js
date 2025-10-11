import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import setupApp from "./app.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Correct place for CORS
const allowedOrigins = [
  "https://lightsave.netlify.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Mount routes after CORS + body parser
setupApp(app);

// ✅ Start server
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
