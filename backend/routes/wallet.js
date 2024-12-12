// Import the required modules
const express = require("express")
const router = express.Router();

const {
    GetWalletDetails
} = require("../controllers/wallet")

const { auth } = require("../middleware/auth");

endpoint = {
    GET: "/",
}

router.get(endpoint.GET,auth, GetWalletDetails)


// Export the router for use in the main application
module.exports = router