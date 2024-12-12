// Import the required modules
const express = require("express")
const router = express.Router();

// Import the required controllers and middleware functions
const {
    login,
    signup,
} = require("../controllers/Auth")


endpoint = {
    LOG_IN: "/login",
    SIGN_UP: "/signup",
    CHANGE_PASSWORD: "/changepassword",
    RESET_PASSWORD_TOKEN: "/reset-password-token",
    RESET_PASSWORD: "/reset-password",
}


// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************


// Route for user login
router.post(endpoint.LOG_IN, login)

router.post(endpoint.SIGN_UP, signup);


// Export the router for use in the main application
module.exports = router