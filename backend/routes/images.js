const express = require("express");
const Image = require("../models/Image");
const Folder = require("../models/Folder");
const auth = require("../middleware/auth");
const uploadMiddleware = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const router = express.Router();

router.use(auth);

router.post("/", uploadMiddleware, async (req, res) => {
    try {
        const { name, folderId } = req.body;
        if (!name || !folderId) {
            return res.status(400).json({ message: "Name and folderId are required" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }
        const folder = await Folder.findOne({ _id: folderId, owner: req.user.id });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "filehive" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            const readable = new Readable();
            readable.push(req.file.buffer);
            readable.push(null);
            readable.pipe(uploadStream);
        });

        const image = await Image.create({
            name,
            folderId,
            owner: req.user.id,
            url: result.secure_url,
            publicId: result.public_id,
            size: result.bytes,
        });

        res.status(201).json(image);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const image = await Image.findOne({ _id: req.params.id, owner: req.user.id });
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        await cloudinary.uploader.destroy(image.publicId);
        await Image.deleteOne({ _id: image._id });
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;