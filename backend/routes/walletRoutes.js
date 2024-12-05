const express = require("express");
const {
  getWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
} = require("../controllers/WalletController");
const router = express.Router();

router.get("/wallets", getWallets);
router.get("/wallet/:id", getWallet);
router.post("/wallet", createWallet);
router.put("/wallet/:id", updateWallet);
router.delete("/wallet/:id", deleteWallet);

module.exports = router;
