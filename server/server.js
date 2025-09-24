import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import setupApp from "./app.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
setupApp(app);

// Start server
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();
