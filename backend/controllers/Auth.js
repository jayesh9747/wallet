const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { msgFunction } = require('../utils/msgFunction')
const { CONFIG } = require('../constants/config')
const { generateUsername } = require('unique-username-generator');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again.",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                username: generateUsername("-", 3),
                email,
                password: hashedPassword,
                accountType: accountType || CONFIG.ACCOUNT_TYPE.USER,
                image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            },
        });

        let wallet = null;

        if (accountType === CONFIG.ACCOUNT_TYPE.USER) {
            wallet = await prisma.wallet.create({
                data: {
                    userId: user.id,
                    balance: 0,
                },
            });

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    linkedWallet: { connect: { id: wallet.id } },
                },
            });
        }

        return res.status(200).json({
            success: true,
            user,
            wallet,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};





exports.login = async (req, res) => {
    try {
        // Get email and password from request body
        const { email, password, platform } = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            return res.status(400).json(
                msgFunction(false, "Please Fill up All the Required Fields")
            );
        }

        // Find user with provided email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // If user not found with provided email
        if (!user) {
            return res.status(401).json(
                msgFunction(false, "User is not Registered with Us Please SignUp to Continue")
            );
        }

        // Generate JWT token and Compare Password
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user.id, account_type: user.accountType, platform: platform },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            // Save token to user document in database
            await prisma.user.update({
                where: { email },
                data: { token },
            });

            // Remove the password field before sending the user object in the response
            delete user.password;

            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            };

            res.cookie("token", token, options);

            return res.status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            });
        } else {
            return res.status(401).json(
                msgFunction(false, `Password is incorrect`)
            );
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(
            msgFunction(false, `Login Failure Please Try Again`)
        );
    }
};



