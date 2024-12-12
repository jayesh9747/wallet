const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const { CONFIG } = require("./constants/config");

// Load environment variables
dotenv.config();

// Initialize Prisma Client
let prisma;
try {
    prisma = new PrismaClient();
    prisma.$connect()
        .then(() => console.log("Prisma Client initialized"))
        .catch((error) => {
            console.error("Prisma Client initialization failed:", error);
            process.exit(1); // Exit the process on failure
        });
} catch (error) {
    console.error("Failed to initialize Prisma Client:", error);
    process.exit(1);
}

// Define allowed origins for CORS
const allowedOrigins = [
    process.env.DEVCLIENT,
    process.env.PRODUCTIONCLIENT
];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// Log Requests and Responses
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    console.log(`Query: ${JSON.stringify(req.query)}`);

    const originalSend = res.send;
    res.send = function (body) {
        console.log(`Response: ${body}`);
        res.send = originalSend;
        return res.send(body);
    };

    next();
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect();

// Routes placeholder
const userRoutes = require("./routes/user");
const TransactionRoutes = require("./routes/transactions");
const WalletRoutes = require("./routes/wallet");


// Define API Endpoints
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running",
    });
});

app.use(CONFIG.APIS.auth, userRoutes);
app.use(CONFIG.APIS.transaction, TransactionRoutes);
app.use(CONFIG.APIS.wallet, WalletRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
});
