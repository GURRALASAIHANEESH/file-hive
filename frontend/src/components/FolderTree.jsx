import FolderNode from "./FolderNode";

export default function FolderTree({ folders, activeFolderId, onFolderClick, onFolderDeleted }) {
    if (!folders || folders.length === 0) {
        return (
            <div style={{ padding: "16px 8px", textAlign: "center" }}>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-sm)" }}>
                    No folders yet
                </p>
            </div>
        );
    }

    return (
        <div className="folder-tree">
            {folders.map((folder) => (
                <div
                    key={folder._id}
                    className={folder._id === activeFolderId ? "folder-tree-item active" : "folder-tree-item"}
                >
                    <FolderNode
                        folder={folder}
                        onOpen={onFolderClick}
                        onDeleted={onFolderDeleted}
                    />
                </div>
            ))}
        </div>
    );
}