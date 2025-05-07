# astrowatch-backend

This is the professional backend server for the **AstroWatch** astrology platform. It handles secure transaction submissions, image uploads (proof of payment), MongoDB storage, and Telegram bot notifications for admins.

---

## 🚀 Features

- 🌐 Express.js server with REST API
- 🖼️ Multer for image uploads
- 🛡️ Input validation and error handling
- ☁️ MongoDB integration using Mongoose
- 📲 Telegram bot notifications for new transactions
- 🔒 Environment-based configuration

---

## 📁 Folder Structure

backend/
├── uploads/                 # Uploaded screenshots stored here  
├── models/Transaction.js    # MongoDB transaction schema  
├── routes/api.js            # All backend API routes  
├── .env                     # Environment variables (not committed)  
├── server.js                # Entry point  
├── package.json  

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/astrowatch-backend.git
cd astrowatch-backend
