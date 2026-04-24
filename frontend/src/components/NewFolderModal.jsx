import { useState, useRef, useEffect } from "react";
import { createFolder } from "../api/folders";

export default function NewFolderModal({ parentId, onClose, onCreated }) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async () => {
        const trimmed = name.trim();
        if (!trimmed) {
            setError("Folder name is required");
            return;
        }
        setError("");
        setSubmitting(true);
        try {
            const res = await createFolder(trimmed, parentId);
            onCreated(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create folder");
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
        if (e.key === "Escape") onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Create new folder</h3>
                <div className="form-group">
                    <label>Folder name</label>
                    <input
                        ref={inputRef}
                        className="input"
                        type="text"
                        placeholder="e.g. Vacation Photos"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                {error && <p className="error-text">{error}</p>}
                <div className="modal-actions">
                    <button className="btn" onClick={onClose} disabled={submitting}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Creating..." : "Create folder"}
                    </button>
                </div>
            </div>
        </div>
    );
}