// server/app.js
import transactionsRoutes from "./routes/transactions.routes.js";
import authRoutes from "./routes/auth.routes.js";
import incomeRoutes from "./routes/income.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import goalRoutes from "./routes/goal.routes.js";

const setupApp = (app) => {
  // API routes
  app.use("/auth", authRoutes);
  app.use("/income", incomeRoutes);
  app.use("/expense", expenseRoutes);
  app.use("/goals", goalRoutes);
  app.use("/transactions", transactionsRoutes);

  // Health check / root route

  app.get("/", (req, res) => {
    res.json({ status: "ok", message: "🚀 LightSave API is running ✅" });
  });
};

export default setupApp;
