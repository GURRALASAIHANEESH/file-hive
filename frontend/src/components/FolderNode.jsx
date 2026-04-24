import { useState } from "react";
import { deleteFolder, renameFolder } from "../api/folders";
import RenameModal from "./RenameModal";

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }
  if (bytes >= 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }
  return bytes + " B";
}

export default function FolderNode({ folder, onOpen, onDeleted, onRenamed }) {
  const [deleting, setDeleting] = useState(false);
  const [showRename, setShowRename] = useState(false);

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

  const handleRenameClick = (e) => {
    e.stopPropagation();
    setShowRename(true);
  };

  const handleRename = async (newName) => {
    await renameFolder(folder._id, newName);
    if (onRenamed) onRenamed();
  };

  return (
    <>
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
            className="btn btn-ghost btn-sm"
            onClick={handleRenameClick}
            title="Rename"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "..." : "Delete"}
          </button>
        </div>
      </div>
      {showRename && (
        <RenameModal
          currentName={folder.name}
          label="folder"
          onClose={() => setShowRename(false)}
          onRename={handleRename}
        />
      )}
    </>
  );
}