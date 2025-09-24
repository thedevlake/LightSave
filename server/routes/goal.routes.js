import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("✅ /goals route hit");
  res.json({ message: "Goals routes working!" });
});

export default router;
