const express = require("express");
const mongoose = require("mongoose");
const Folder = require("../models/Folder");
const Image = require("../models/Image");
const auth = require("../middleware/auth");
const computeFolderSize = require("../utils/folderSize");

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
    try {
        const folders = await Folder.find({ owner: req.user.id, parentId: null }).lean();
        const results = await Promise.all(
            folders.map(async (folder) => {
                const size = await computeFolderSize(folder._id, req.user.id);
                return { ...folder, size };
            })
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, parentId } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Folder name is required" });
        }
        if (parentId) {
            const parent = await Folder.findOne({ _id: parentId, owner: req.user.id });
            if (!parent) {
                return res.status(404).json({ message: "Parent folder not found" });
            }
        }
        const folder = await Folder.create({
            name,
            owner: req.user.id,
            parentId: parentId || null,
        });
        res.status(201).json(folder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const folder = await Folder.findOne({ _id: req.params.id, owner: req.user.id }).lean();
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        const children = await Folder.find({ parentId: folder._id, owner: req.user.id }).lean();
        const childrenWithSize = await Promise.all(
            children.map(async (child) => {
                const size = await computeFolderSize(child._id, req.user.id);
                return { ...child, size };
            })
        );
        const images = await Image.find({ folderId: folder._id, owner: req.user.id }).lean();
        const size = await computeFolderSize(folder._id, req.user.id);
        res.json({ ...folder, size, children: childrenWithSize, images });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user.id });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    folder.name = name.trim();
    await folder.save();
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
    try {
        const ownerObjectId = new mongoose.Types.ObjectId(req.user.id);
        const folderObjectId = new mongoose.Types.ObjectId(req.params.id);

        const folder = await Folder.findOne({ _id: folderObjectId, owner: ownerObjectId });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        const descendants = await Folder.aggregate([
            { $match: { _id: folderObjectId, owner: ownerObjectId } },
            {
                $graphLookup: {
                    from: "folders",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parentId",
                    as: "descendants",
                    restrictSearchWithMatch: { owner: ownerObjectId },
                },
            },
            {
                $project: {
                    allIds: { $concatArrays: [["$_id"], "$descendants._id"] },
                },
            },
        ]);

        const allFolderIds = descendants.length ? descendants[0].allIds : [folderObjectId];

        const images = await Image.find({ folderId: { $in: allFolderIds }, owner: ownerObjectId });
        const cloudinary = require("../config/cloudinary");
        await Promise.all(
            images.map((img) => cloudinary.uploader.destroy(img.publicId))
        );

        await Image.deleteMany({ folderId: { $in: allFolderIds }, owner: ownerObjectId });
        await Folder.deleteMany({ _id: { $in: allFolderIds }, owner: ownerObjectId });

        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;