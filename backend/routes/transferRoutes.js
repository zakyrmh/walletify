const express = require("express");
const {
  getTransfers,
  getTransfer,
  createTransfer,
  deleteTransfer,
} = require("../controllers/TransferController");
const router = express.Router();

router.get("/api/transfers", getTransfers);
router.get("/api/transfer/:id", getTransfer);
router.post("/api/transfer/create", createTransfer);
// router.put("/api/transfers/:id", updateTransfer);
router.delete("/api/transfer/:id", deleteTransfer);

module.exports = router;
