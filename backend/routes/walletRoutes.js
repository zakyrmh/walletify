const express = require("express");
const {
  getWallets,
  createWallet,
  updateWallet,
  deleteWallet,
} = require("../controllers/WalletController");
const router = express.Router();

router.get("/wallets", getWallets);
router.post("/wallets", createWallet);
router.put("/wallets/:id", updateWallet);
router.delete("/wallets/:id", deleteWallet);

module.exports = router;
