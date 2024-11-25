const express = require("express");
const Wallet = require("../models/Wallet");
const router = express.Router();

// Create Wallet
router.post("/", async (req, res) => {
  const { name } = req.body;
  const wallet = new Wallet({ name });
  await wallet.save();
  res.json(wallet);
});

// Read Wallets
router.get("/", async (req, res) => {
  const wallets = await Wallet.find();
  res.json(wallets);
});

// Update Wallet
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, balance } = req.body;
  const wallet = await Wallet.findByIdAndUpdate(
    id,
    { name, balance },
    { new: true }
  );
  res.json(wallet);
});

// Delete Wallet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Wallet.findByIdAndDelete(id);
  res.json({ message: "Wallet deleted" });
});

module.exports = router;
