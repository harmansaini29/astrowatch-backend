const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const Transaction = require('../models/Transaction'); // Mongoose model

// ────── Static Horoscope Data ──────
const horoscopes = {
  aries: "Today is a good day to assert yourself and take action.",
  taurus: "Focus on stability and comfort today.",
  gemini: "Communication is key today. Speak your mind.",
  cancer: "Take care of your emotional well-being.",
  leo: "Your charisma shines bright today!",
  virgo: "Be detail-oriented and help others.",
  libra: "Seek harmony in your relationships.",
  scorpio: "You may feel intense—channel it wisely.",
  sagittarius: "Explore something new today!",
  capricorn: "Stay disciplined—progress is near.",
  aquarius: "Innovate and break the mold.",
  pisces: "Follow your intuition today.",
};

router.post('/horoscope', (req, res) => {
  const { sign } = req.body;
  if (!sign) {
    return res.status(400).json({ error: 'Sign is required.' });
  }

  const description = horoscopes[sign.toLowerCase()];
  if (!description) {
    return res.status(404).json({ error: 'Horoscope not found.' });
  }

  return res.status(200).json({ description });
});

// ────── Multer Setup ──────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = 'txn-' + Date.now() + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ────── Telegram Bot Setup ──────
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
const chatId = process.env.TELEGRAM_CHAT_ID;

// ────── Submit Transaction ──────
router.post('/submit-transaction', upload.single('screenshot'), async (req, res) => {
  try {
    const { senderName, transactionId } = req.body;
    const paymentImage = req.file;

    if (!senderName || !transactionId || !paymentImage) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    // Save to DB
    const newTransaction = new Transaction({
      name: senderName,
      transactionId,
      imageUrl: paymentImage.filename,
    });
    await newTransaction.save();

    // Telegram alert
    const imagePath = path.join(__dirname, '..', 'uploads', paymentImage.filename);
    const caption = `💸 *New Payment Received!*\n\n👤 *Name:* ${senderName}\n🆔 *Transaction ID:* ${transactionId}`;

    try {
      await bot.sendPhoto(chatId, fs.createReadStream(imagePath), {
        caption,
        parse_mode: 'Markdown',
      });
    } catch (telegramErr) {
      console.warn('⚠️ Telegram error (not fatal):', telegramErr.message);
      // Don't block frontend response
    }

    res.status(200).json({
      success: true,
      message: 'Transaction submitted and Telegram notified.',
    });
  } catch (err) {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error occurred.',
    });
  }
});

module.exports = router;
