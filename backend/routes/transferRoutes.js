const express = require("express");
const {
  getTransfers,
  createTransfer,
} = require("../controllers/TransferController");
const router = express.Router();

router.get("/transfers", getTransfers);
router.post("/transfers", createTransfer);
// router.put("/transfers/:id", updateTransfer);
// router.delete("/transfers/:id", deleteTransfer);

module.exports = router;
