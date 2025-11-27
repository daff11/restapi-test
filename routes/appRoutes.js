const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth_token.js");
const uploadImage = require("../middleware/uploadImage.js");

const { register, login, getProfile, updateProfile, uploadProfileImage } = require("../controller/userController.js");
router.post("/register", register);
router.post("/login", login);

router.get("/profile", auth, getProfile);
router.put("/profile/update", auth, updateProfile);
router.put("/profile/image", auth, uploadImage, uploadProfileImage);


// Module Information
const { getAllBanners, getAllServices } = require("../controller/infoController.js");
router.get("/banner", getAllBanners);
router.get("/services", auth, getAllServices);

// Module Transaction
const { getBalance, topupBalance, createTransaction, getTransactionHistory } = require("../controller/transactionController.js");
router.get("/balance", auth, getBalance);
router.post("/topup", auth, topupBalance);
router.post("/transaction", auth, createTransaction);
router.get("/transaction/history", auth, getTransactionHistory);


module.exports = router;