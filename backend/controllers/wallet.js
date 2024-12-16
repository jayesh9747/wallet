const { msgFunction } = require('../utils/msgFunction');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.GetWalletDetails = async (req, res) => {
    try {
        const { id } = req.user;

        const wallet = await prisma.wallet.findUnique({
            where: { userId: id },
        });

        const transaction = await prisma.transaction.findMany({
            where: { userId: id },
        })

        if (!wallet) {
            return res.status(404).json(
                msgFunction(false, "Wallet not found for this user")
            );
        }

        const result = {
            wallet,
            transaction
        }

        return res.status(200).json(
            msgFunction(true, "Wallet details fetched successfully", result)
        );
    } catch (error) {
        return res.status(500).json(
            msgFunction(false, "An error occurred while fetching the user wallet details", error.message)
        );
    }
};