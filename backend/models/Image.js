const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Image", imageSchema);