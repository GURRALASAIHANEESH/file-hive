import { useState } from "react";
import { uploadImage } from "../api/images";

export default function UploadModal({ folderId, onClose, onUploaded }) {
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async () => {
        const trimmed = name.trim();
        if (!trimmed) {
            setError("Image name is required");
            return;
        }
        if (!file) {
            setError("Please select an image file");
            return;
        }
        setError("");
        setUploading(true);
        try {
            const res = await uploadImage(trimmed, folderId, file);
            onUploaded(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Upload image</h3>
                <div className="form-group">
                    <label>Image name</label>
                    <input
                        className="input"
                        type="text"
                        placeholder="e.g. Sunset at beach"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Choose file</label>
                    <input
                        className="input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0] || null)}
                        style={{ padding: "8px" }}
                    />
                </div>
                {file && (
                    <div style={{ fontSize: "var(--font-sm)", color: "var(--color-text-muted)", marginBottom: "8px" }}>
                        Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                )}
                {error && <p className="error-text">{error}</p>}
                <div className="modal-actions">
                    <button className="btn" onClick={onClose} disabled={uploading}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={uploading}>
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
}