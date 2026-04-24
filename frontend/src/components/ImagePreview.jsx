import { useState } from "react";
import { deleteImage } from "../api/images";

function formatSize(bytes) {
    if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
    if (bytes >= 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
    }
    return bytes + " B";
}

export default function ImagePreview({ image, onClose, onDeleted }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteImage(image._id);
            onDeleted(image._id);
            onClose();
        } catch {
            setDeleting(false);
        }
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = image.url;
        link.target = "_blank";
        link.download = image.name;
        link.click();
    };

    return (
        <div className="preview-overlay" onClick={onClose}>
            <div className="preview-container" onClick={(e) => e.stopPropagation()}>
                <div className="preview-header">
                    <div className="preview-info">
                        <h3 className="preview-name">{image.name}</h3>
                        <span className="preview-meta">{formatSize(image.size)}</span>
                        {image.createdAt && (
                            <span className="preview-meta">
                                {new Date(image.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        )}
                    </div>
                    <div className="preview-actions">
                        <button className="btn btn-sm" onClick={handleDownload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Open
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            {deleting ? "..." : "Delete"}
                        </button>
                        <button className="btn btn-ghost btn-sm preview-close-btn" onClick={onClose}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="preview-body">
                    <img className="preview-image" src={image.url} alt={image.name} />
                </div>
            </div>
        </div>
    );
}