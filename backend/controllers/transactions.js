const { msgFunction } = require('../utils/msgFunction');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.AddTransaction = async (req, res) => {
    try {
        const { id } = req.user; // Authenticated user ID
        const {
            amount,
            type,
            category,
            description,
            recurringInterval,
            nextTransactionDate,
        } = req.body;

        // Check if the user's wallet exists
        const wallet = await prisma.wallet.findUnique({
            where: { userId: id },
        });

        if (!wallet) {
            return res.status(404).json(
                msgFunction(false, "Wallet not found for this user, please create a new wallet")
            );
        }

        // Handle image upload to Cloudinary
        let imageUrl = null;
        if (req.files && req.files.InvoiceImage) {
            const file = req.files.InvoiceImage[0];
            try {
                const result = await uploadImageToCloudinary(file, "transactions");
                imageUrl = result.secure_url;
            } catch (error) {
                return res.status(500).json(
                    msgFunction(false, "Failed to upload image to Cloudinary", error.message)
                );
            }
        }

        // Ensure that the amount is a valid float
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            return res.status(400).json(
                msgFunction(false, "Invalid amount provided. Please enter a valid number.")
            );
        }

        // Ensure 'type' is a valid TransactionType enum
        const validTypes = ['SEND', 'RECEIVE']; // Assuming the enum values are 'SEND' and 'RECEIVE'
        if (!validTypes.includes(type)) {
            return res.status(400).json(
                msgFunction(false, "Invalid transaction type provided. Valid values are 'SEND' or 'RECEIVE'.")
            );
        }

        // Ensure 'category' is a valid TransactionCategory enum
        const validCategories = ['SHOPPING', 'FOOD', 'OTHERS']; // Example valid categories
        if (!validCategories.includes(category)) {
            return res.status(400).json(
                msgFunction(false, "Invalid category provided. Valid values are 'SHOPPING', 'FOOD', or 'OTHERS'.")
            );
        }


        // Parse nextTransactionDate if provided and ensure it's a valid date
        let parsedNextTransactionDate = null;
        if (nextTransactionDate) {
            parsedNextTransactionDate = new Date(nextTransactionDate);
            if (isNaN(parsedNextTransactionDate)) {
                return res.status(400).json(
                    msgFunction(false, "Invalid nextTransactionDate format. Please use a valid date string.")
                );
            }
        }

        // Create a new transaction
        const newTransaction = await prisma.transaction.create({
            data: {
                userId: id,
                amount: parsedAmount,
                type, // Assuming TransactionType ENUM validation in Prisma
                category, // Assuming TransactionCategory ENUM validation in Prisma
                description: description || null, // Make sure description is handled as nullable
                imageUrl,
                recurringInterval, // Assuming RecurringInterval ENUM validation in Prisma
                nextTransactionDate: parsedNextTransactionDate || null, // If null, ensure it is saved as null
            },
        });

        // Update wallet balance
        const updatedBalance =
            type === "SEND" ? wallet.balance - parsedAmount : wallet.balance + parsedAmount;

        const totalOutgoing = type === "SEND" ? wallet.totalIncoming + parsedAmount : wallet.totalIncoming
        const totalIncoming = type === "RECEIVE" ? wallet.totalOutgoing + parsedAmount : wallet.totalOutgoing

        await prisma.wallet.update({
            where: { userId: id },
            data: { balance: updatedBalance , totalOutgoing ,totalIncoming },
        });

        // Return success response
        return res.status(201).json(
            msgFunction(true, "Transaction added successfully", newTransaction)
        );
    } catch (error) {
        console.error("Error adding transaction:", error);
        return res.status(500).json(
            msgFunction(false, "An error occurred while adding the transaction", error.message)
        );
    }
}


exports.FilterTransactionHistory = async (req, res) => {
    try {
        const { id } = req.user;
        const { category, startDate, endDate } = req.query;

        const filters = {
            userId: id,
        };

        if (category) filters.category = category;
        if (startDate || endDate) {
            filters.date = {};
            if (startDate) filters.date.gte = new Date(startDate);
            if (endDate) filters.date.lte = new Date(endDate);
        }

        const transactions = await prisma.transaction.findMany({
            where: filters,
            orderBy: {
                date: 'desc',
            },
        });

        return res.status(200).json(
            msgFunction(true, "Transaction history fetched successfully", transactions)
        );
    } catch (error) {
        return res.status(500).json(
            msgFunction(false, "An error occurred while fetching the transaction history", error.message)
        );
    }
};