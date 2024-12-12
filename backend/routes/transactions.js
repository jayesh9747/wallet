// Import the required modules
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Import the required controllers and middleware functions
const { AddTransaction, FilterTransactionHistory } = require("../controllers/transactions");

const { auth } = require("../middleware/auth");

endpoint = {
    ADD: "/add",
    HISTORY: '/history'
};

// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit set to 20 MB
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images are allowed."));
        }
    },
});

router.post(endpoint.ADD, auth, upload.fields([{ name: "InvoiceImage", maxCount: 1 }]), AddTransaction);
router.get(endpoint.HISTORY, auth, FilterTransactionHistory);

module.exports = router
