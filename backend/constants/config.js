require("dotenv").config();

const CONFIG = {
    DB: {
        DB_HOST: process.env.MONGODB_URL,
        DB_NAME: process.env.DB_NAME,
    },
    APIS: {
        auth: "/api/v1/auth",
        profile: "/api/v1/profile",
        transaction: "/api/v1/transactions",
        wallet: "/api/v1/wallet"
    },
    KEYS: {
        CLOUDINARY: {
            CLOUD_NAME: process.env.CLOUD_NAME,
            API_KEY: process.env.CLOUDINARY_API_KEY,
            API_SECRET: process.env.CLOUDINARY_API_SECRET
        },
        NODEMAILER: {
            MAIL_HOST: process.env.MAIL_HOST,
            MAIL_USER: process.env.MAIL_USER,
            HOST_PASS: process.env.MAIL_PASS
        }
    },
    JWT: {
        TOKEN: process.env.JWT_SECRET
    },
    ACCOUNT_TYPE: {
        USER: "USER",
        ADMIN: "ADMIN",
    },
};

module.exports = {
    CONFIG,
};
