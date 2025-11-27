const db = require("../config/dbConfig.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register user
 *     tags: [1. Module Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
const register = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        status: 101,
        message: "Semua field wajib diisi",
        data: null,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 102,
        message: "Parameter email tidak sesuai format",
        data: null,
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 104,
        message: "Password minimal 8 karakter",
        data: null,
      });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (email, first_name, last_name, password) VALUES (?,?,?,?)";
    await db.execute(query, [email, first_name, last_name, hashedPwd]);

    return res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 505,
      message: "Server error",
      data: null,
    });
  }
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login User
 *     tags: [1. Module Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Berhasil Login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 101,
        message: "Semua field wajib diisi",
        data: null,
      });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(query, [email]);
    if (rows.length === 0) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "12h" }
    );

    return res.status(200).json({
      status: 0,
      message: "Login Sukses",
      data: { token },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 505,
      message: "Server error",
      data: null,
    });
  }
};

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get Profile
 *     tags: [1. Module Membership]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     profile_image:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const getProfile = async (req, res) => {
    try {
        const {id} = req.user;
        const query = "SELECT id, email, first_name, last_name, profile_image FROM users WHERE id = ?";
        const [rows] = await db.execute(query, [id]);

        if (rows.length == 0) {
            return res.status(404).json({
                status: 104, message: "User not found", data: null
            });
        }

        const user = rows[0];
        return res.status(200).json({
            status: 0,
            message: "Sukses",
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: user.profile_image ?? null
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 505,
            message: "Server error",
            data: null,
        });
    }
}

/**
 * @swagger
 * /profile/update:
 *   put:
 *     summary: Update Profile
 *     tags: [1. Module Membership]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *             required:
 *               - first_name
 *               - last_name
 *     responses:
 *       200:
 *         description: Request Successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const updateProfile = async (req, res) => {
    try {
        const {id} = req.user;
        const {first_name, last_name} = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({
                status: 101,
                message: "Field wajib diisi semua",
                data: null,
            })
        }

        const updatequery = "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?";
        const [result] = await db.execute(updatequery, [first_name, last_name, id]);
        if (!result.rows === 0) {
            return res.status(404).json({
                status:  104,
                message: "User not found",
                data: null
            })
        }

        const getAllquery = "SELECT * FROM users WHERE id = ?";
        const [rows] = await db.execute(getAllquery, [id]);
        const user = rows[0];
        return res.status(200).json({
            status: 0,
            message: "Request Successfully",
            data: {
                email: user.email, 
                first_name: user.first_name, 
                last_name: user.last_name, 
                profile_image: user.profile_image},
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 505,
            message: "Server error",
            data: null,
        });
    }
}

/**
 * @swagger
 * /profile/image:
 *   put:
 *     summary: Update Profile Photo
 *     tags: [1. Module Membership]
 *     description: Upload profile image (JPEG/PNG only). Requires Bearer Token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Successfully updated profile image
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
*/
const uploadProfileImage = async (req, res) => {
    try {
      const { id } = req.user;
      if (!req.file) {
          return res.status(400).json({
              status: 102,
              message: "Field file tidak boleh kosong",
              data: null,
          });
      }

      const imageUrl = `${process.env.BASE_URL}/profile/${req.file.filename}`;
      const updateQuery = "UPDATE users SET profile_image = ? WHERE id = ?";
      const [result] = await db.execute(updateQuery, [imageUrl, id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({
              status: 104,
              message: "User not found",
              data: null,
          });
      }

      const [rows] = await db.execute(
          "SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?",
          [id]
      );
      const user = rows[0];

      return res.status(200).json({
          status: 0,
          message: "Update Profile Image berhasil",
          data: user,
      });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 505,
            message: "Server error",
            data: null,
        });
    }
};

module.exports = { register, login, getProfile, updateProfile, uploadProfileImage};
