const multer = require("multer");
const path = require("path");
const fs = require("fs");

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("FORMAT_NOT_ALLOWED"));
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderPath = path.join(__dirname, "../profile");
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}${ext}`);
    }
});
const upload = multer({ storage, fileFilter }).single("file");

const uploadImage = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            if (err.message === "FORMAT_NOT_ALLOWED") {
                return res.status(400).json({
                    status: 102,
                    message: "Format Image tidak sesuai",
                    data: null,
                });
            }
            return res.status(400).json({
                status: 101,
                message: err.message,
                data: null,
            });
        }
        next();
    });
};

module.exports = uploadImage;
