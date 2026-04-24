const express = require("express");
const Folder = require("../models/Folder");
const Image = require("../models/Image");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);

const toolManifest = [
    {
        name: "list_folders",
        description: "Lists top-level folders or children of a given parentId for the authenticated user",
        inputSchema: {
            type: "object",
            properties: {
                parentId: { type: "string", description: "Optional parent folder id" },
            },
        },
    },
    {
        name: "create_folder",
        description: "Creates a new folder for the authenticated user",
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string" },
                parentId: { type: "string" },
            },
            required: ["name"],
        },
    },
    {
        name: "list_images",
        description: "Lists images inside a given folder for the authenticated user",
        inputSchema: {
            type: "object",
            properties: {
                folderId: { type: "string" },
            },
            required: ["folderId"],
        },
    },
];

router.get("/tools", (req, res) => {
    res.json({ tools: toolManifest });
});

async function handleListFolders(req, params) {
    const query = { owner: req.user.id, parentId: params.parentId || null };
    const folders = await Folder.find(query).lean();
    return folders;
}

async function handleCreateFolder(req, params) {
    const { name, parentId } = params;
    if (!name) {
        throw { code: -32602, message: "name is required" };
    }
    if (parentId) {
        const parent = await Folder.findOne({ _id: parentId, owner: req.user.id });
        if (!parent) {
            throw { code: -32602, message: "Parent folder not found" };
        }
    }
    const folder = await Folder.create({
        name,
        owner: req.user.id,
        parentId: parentId || null,
    });
    return folder;
}

async function handleListImages(req, params) {
    const { folderId } = params;
    if (!folderId) {
        throw { code: -32602, message: "folderId is required" };
    }
    const folder = await Folder.findOne({ _id: folderId, owner: req.user.id });
    if (!folder) {
        throw { code: -32602, message: "Folder not found" };
    }
    const images = await Image.find({ folderId, owner: req.user.id }).lean();
    return images;
}

const handlers = {
    list_folders: handleListFolders,
    create_folder: handleCreateFolder,
    list_images: handleListImages,
};

router.post("/call", async (req, res) => {
    try {
        const { method, params } = req.body;
        const handler = handlers[method];
        if (!handler) {
            return res.json({ error: { code: -32601, message: "Method not found" } });
        }
        const result = await handler(req, params || {});
        res.json({ result });
    } catch (err) {
        if (err.code) {
            return res.json({ error: { code: err.code, message: err.message } });
        }
        res.status(500).json({ error: { code: -32603, message: err.message } });
    }
});

module.exports = router;