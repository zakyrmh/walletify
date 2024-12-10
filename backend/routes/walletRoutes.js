const express = require("express");
const {
  getWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
} = require("../controllers/WalletController");
const router = express.Router();

router.get("/api/wallets", getWallets);
router.get("/api/wallet/:id", getWallet);
router.post("/api/wallet", createWallet);
router.put("/api/wallet/:id", updateWallet);
router.delete("/api/wallet/:id", deleteWallet);

module.exports = router;
