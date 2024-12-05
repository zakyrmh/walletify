const express = require("express");
const {
  getTransfers,
  getTransfer,
  createTransfer,
  deleteTransfer,
} = require("../controllers/TransferController");
const router = express.Router();

router.get("/transfers", getTransfers);
router.get("/transfer/:id", getTransfer);
router.post("/transfer/create", createTransfer);
// router.put("/transfers/:id", updateTransfer);
router.delete("/transfer/:id", deleteTransfer);

module.exports = router;
