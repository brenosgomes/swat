const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "tmp", "uploads"));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                file.key = `${hash.toString("hex")}-${file.originalname}`;

                cb(null, file.key);
            });
        },
    }),
};

module.exports = {
    dest: path.resolve(__dirname, "..", "tmp", "uploads"),
    storage: storageTypes["local"],
    limit: {
        fileSize: 1 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "file"){
            allowedMimes = [
                "application/pdf",
                "application/docx",
                "application/msword"
            ]
        } else {
            allowedMimes = [
                "image/jpg",    
                "image/jpeg",
                "image/png"
            ]
        }

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"));
        }
    },
};
