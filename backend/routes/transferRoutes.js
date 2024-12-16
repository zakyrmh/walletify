const express = require("express");
const {
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  deleteTransfer,
} = require("../controllers/TransferController");
const router = express.Router();

router.get("/api/transfers", getTransfers);
router.get("/api/transfer/:id", getTransfer);
router.post("/api/transfer", createTransfer);
router.put("/api/transfer/:id", updateTransfer);
router.delete("/api/transfer/:id", deleteTransfer);

module.exports = router;
