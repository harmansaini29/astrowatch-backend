const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
}, {
  timestamps: true  // <-- Automatically adds createdAt and updatedAt
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
