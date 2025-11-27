const db = require("../config/dbConfig.js");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /banner:
 *   get:
 *     summary: Get all banners
 *     tags: [2. Module Information]
 *     responses:
 *       200:
 *         description: Request Successfully
 */
const getAllBanners = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT banner_name, banner_image, description FROM banner");
        return res.status(200).json({ 
            status: 0, 
            message: "Sukses", 
            data: rows 
        });
    } catch (err) {
        return res.status(500).json({ 
            status: 505, 
            message: "Server error" 
        });
    }
};

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services
 *     tags: [2. Module Information]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Request Successfully
 */
const getAllServices = async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT service_code, service_name, service_icon, service_tariff FROM service"
        );
        return res.status(200).json({ 
            status: 0, 
            message: "Sukses", 
            data: rows });
    } catch (err) {
        return res.status(500).json({ 
            status: 505, 
            message: "Server error" 
        });
    }
};

module.exports = {getAllBanners, getAllServices};