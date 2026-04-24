export default function Breadcrumb({ path, onNavigate }) {
    return (
        <div className="breadcrumb">
            <span
                className={path.length === 0 ? "breadcrumb-item breadcrumb-current" : "breadcrumb-item breadcrumb-link"}
                onClick={path.length > 0 ? () => onNavigate(null) : undefined}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px", verticalAlign: "-2px" }}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                My Drive
            </span>
            {path.map((item, index) => {
                const isLast = index === path.length - 1;
                return (
                    <span key={item._id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="breadcrumb-separator">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </span>
                        <span
                            className={isLast ? "breadcrumb-item breadcrumb-current" : "breadcrumb-item breadcrumb-link"}
                            onClick={!isLast ? () => onNavigate(item._id) : undefined}
                        >
                            {item.name}
                        </span>
                    </span>
                );
            })}
        </div>
    );
}