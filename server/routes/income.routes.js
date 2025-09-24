import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Income routes working!" });
});

export default router;
