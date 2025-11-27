const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak valid atau kadaluwarsa",
            data: null
        });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token invalid" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Token invalid" });
    }
}

module.exports = auth;