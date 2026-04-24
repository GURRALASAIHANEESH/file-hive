import { useState } from "react";
import { deleteFolder } from "../api/folders";

function formatSize(bytes) {
    if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
    if (bytes >= 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
    }
    return bytes + " B";
}

export default function FolderNode({ folder, onOpen, onDeleted }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (e) => {
        e.stopPropagation();
        setDeleting(true);
        try {
            await deleteFolder(folder._id);
            onDeleted(folder._id);
        } catch {
            setDeleting(false);
        }
    };

    return (
        <div className="folder-row" onClick={() => onOpen(folder._id)}>
            <div className="folder-row-left">
                <span className="folder-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                </span>
                <span className="folder-name">{folder.name}</span>
                <span className="folder-size">{formatSize(folder.size || 0)}</span>
            </div>
            <div className="folder-row-right">
                <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? "..." : "Delete"}
                </button>
            </div>
        </div>
    );
}