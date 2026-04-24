import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "var(--color-primary)" }}>
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="var(--color-primary-light)" />
                    <path d="M2 8h20" stroke="currentColor" strokeWidth="2" />
                    <rect x="5" y="11" width="6" height="6" rx="1" fill="currentColor" opacity="0.3" />
                    <rect x="13" y="11" width="6" height="6" rx="1" fill="currentColor" opacity="0.3" />
                </svg>
                <span className="topbar-logo">FileHive</span>
            </div>
            <div className="topbar-right">
                <span className="topbar-email">{user?.email}</span>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    );
}