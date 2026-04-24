const mongoose = require("mongoose");
const Folder = require("../models/Folder");
const Image = require("../models/Image");

const computeFolderSize = async (folderId, userId) => {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    const folderObjectId = new mongoose.Types.ObjectId(folderId);

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
                allIds: {
                    $concatArrays: [["$_id"], "$descendants._id"],
                },
            },
        },
    ]);

    if (!descendants.length) {
        return 0;
    }

    const folderIds = descendants[0].allIds;

    const result = await Image.aggregate([
        {
            $match: {
                folderId: { $in: folderIds },
                owner: ownerObjectId,
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$size" },
            },
        },
    ]);

    return result.length ? result[0].total : 0;
};

module.exports = computeFolderSize;