const Transfer = require("../models/Transfer");

const getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTransfer = async (req, res) => {
  try {
    const { description, amount, date, senderWalletId, receiverWalletId } =
      req.body;

    if (!description || !amount || !senderWalletId || !receiverWalletId) {
      return res.status(400).json({
        message:
          "Description, amount, senderWalletId, and receiverWalletId are required.",
      });
    }

    const transfer = new Transfer({
      description,
      amount,
      senderWalletId,
      receiverWalletId,
      date,
    });
    await transfer.save();
    res.status(201).json(transfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getTransfers, createTransfer };