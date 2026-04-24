import { useState } from "react";
import { deleteImage } from "../api/images";
import ImagePreview from "./ImagePreview";

function formatSize(bytes) {
    if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
    if (bytes >= 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
    }
    return bytes + " B";
}

function ImageCard({ image, onDeleted, onPreview }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (e) => {
        e.stopPropagation();
        setDeleting(true);
        try {
            await deleteImage(image._id);
            onDeleted(image._id);
        } catch {
            setDeleting(false);
        }
    };

    return (
        <div className="image-card" onClick={() => onPreview(image)}>
            <div className="image-card-img-wrapper">
                <img className="image-card-img" src={image.url} alt={image.name} />
                <div className="image-card-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                </div>
            </div>
            <div className="image-card-body">
                <span className="image-card-name">{image.name}</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                    <span className="image-card-size">{formatSize(image.size)}</span>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{ padding: "2px 8px", fontSize: "11px" }}
                    >
                        {deleting ? "..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ImageGrid({ images, onDeleted }) {
    const [previewImage, setPreviewImage] = useState(null);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div>
            <p className="section-label">Images</p>
            <div className="image-grid">
                {images.map((img) => (
                    <ImageCard
                        key={img._id}
                        image={img}
                        onDeleted={onDeleted}
                        onPreview={setPreviewImage}
                    />
                ))}
            </div>
            {previewImage && (
                <ImagePreview
                    image={previewImage}
                    onClose={() => setPreviewImage(null)}
                    onDeleted={onDeleted}
                />
            )}
        </div>
    );
}