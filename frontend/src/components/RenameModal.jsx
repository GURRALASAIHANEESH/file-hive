import { useState, useRef, useEffect } from "react";

export default function RenameModal({ currentName, label, onClose, onRename }) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    if (trimmed === currentName) {
      onClose();
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onRename(trimmed);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Rename failed");
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
        <h3 className="modal-title">Rename {label}</h3>
        <div className="form-group">
          <label>New name</label>
          <input
            ref={inputRef}
            className="input"
            type="text"
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
            {submitting ? "Saving..." : "Rename"}
          </button>
        </div>
      </div>
    </div>
  );
}
