import { useState, useEffect, useCallback } from "react";
import { getFolders, getFolder } from "../api/folders";
import Topbar from "../components/Topbar";
import Breadcrumb from "../components/Breadcrumb";
import FolderTree from "../components/FolderTree";
import FolderNode from "../components/FolderNode";
import ImageGrid from "../components/ImageGrid";
import NewFolderModal from "../components/NewFolderModal";
import UploadModal from "../components/UploadModal";

export default function Drive() {
    const [folders, setFolders] = useState([]);
    const [activeFolderId, setActiveFolderId] = useState(null);
    const [activeFolder, setActiveFolder] = useState(null);
    const [path, setPath] = useState([]);
    const [showNewFolder, setShowNewFolder] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadTopLevel = useCallback(async () => {
        try {
            const res = await getFolders();
            setFolders(res.data);
        } catch {
            setFolders([]);
        }
    }, []);

    useEffect(() => {
        loadTopLevel().finally(() => setLoading(false));
    }, [loadTopLevel]);

    useEffect(() => {
        if (!activeFolderId) {
            setActiveFolder(null);
            return;
        }
        let cancelled = false;
        getFolder(activeFolderId)
            .then((res) => {
                if (!cancelled) setActiveFolder(res.data);
            })
            .catch(() => {
                if (!cancelled) {
                    setActiveFolder(null);
                    setActiveFolderId(null);
                    setPath([]);
                }
            });
        return () => { cancelled = true; };
    }, [activeFolderId]);

    const navigateToFolder = (id) => {
        if (id === null) {
            setActiveFolderId(null);
            setActiveFolder(null);
            setPath([]);
            return;
        }
        setActiveFolderId(id);
        setPath((prev) => {
            const index = prev.findIndex((p) => p._id === id);
            if (index !== -1) return prev.slice(0, index + 1);
            return prev;
        });
    };

    const openFolder = (id, name) => {
        setActiveFolderId(id);
        setPath((prev) => {
            const index = prev.findIndex((p) => p._id === id);
            if (index !== -1) return prev.slice(0, index + 1);
            return [...prev, { _id: id, name }];
        });
    };

    const handleSidebarFolderClick = (id) => {
        const folder = folders.find((f) => f._id === id);
        if (folder) {
            setPath([{ _id: folder._id, name: folder.name }]);
            setActiveFolderId(id);
        }
    };

    const handleSidebarFolderDeleted = async (id) => {
        await loadTopLevel();
        if (activeFolderId === id) navigateToFolder(null);
    };

    const handleMainFolderDeleted = async () => {
        if (activeFolderId) {
            try {
                const res = await getFolder(activeFolderId);
                setActiveFolder(res.data);
            } catch {
                navigateToFolder(null);
            }
        }
        await loadTopLevel();
    };

    const handleImageDeleted = async () => {
        if (activeFolderId) {
            try {
                const res = await getFolder(activeFolderId);
                setActiveFolder(res.data);
            } catch {
                navigateToFolder(null);
            }
        }
        await loadTopLevel();
    };

    const handleFolderCreated = async () => {
        if (activeFolderId) {
            try {
                const res = await getFolder(activeFolderId);
                setActiveFolder(res.data);
            } catch {
                navigateToFolder(null);
            }
        }
        await loadTopLevel();
    };

    const handleImageUploaded = async () => {
        if (activeFolderId) {
            try {
                const res = await getFolder(activeFolderId);
                setActiveFolder(res.data);
            } catch {
                navigateToFolder(null);
            }
        }
        await loadTopLevel();
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "var(--color-text-muted)" }}>
                Loading...
            </div>
        );
    }

    const hasChildren = activeFolder?.children?.length > 0;
    const hasImages = activeFolder?.images?.length > 0;

    return (
        <div className="drive-page">
            <Topbar />
            <div className="drive-layout">
                <aside className="drive-sidebar">
                    <div className="sidebar-header">
                        <h3>Folders</h3>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowNewFolder(true)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New
                        </button>
                    </div>
                    <FolderTree
                        folders={folders}
                        activeFolderId={activeFolderId}
                        onFolderClick={handleSidebarFolderClick}
                        onFolderDeleted={handleSidebarFolderDeleted}
                    />
                </aside>
                <main className="drive-main">
                    <Breadcrumb path={path} onNavigate={navigateToFolder} />

                    {!activeFolderId ? (
                        <div>
                            <div className="drive-content-header">
                                <h2 className="drive-heading">My Drive</h2>
                            </div>
                            {folders.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                            <line x1="12" y1="11" x2="12" y2="17" />
                                            <line x1="9" y1="14" x2="15" y2="14" />
                                        </svg>
                                    </div>
                                    <p className="empty-state-title">No folders yet</p>
                                    <p className="empty-state-desc">
                                        Create your first folder to start organizing your images in the cloud.
                                    </p>
                                    <button className="btn btn-primary" onClick={() => setShowNewFolder(true)}>
                                        Create your first folder
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="section-label">All folders</p>
                                    <div className="folder-list">
                                        {folders.map((folder) => (
                                            <FolderNode
                                                key={folder._id}
                                                folder={folder}
                                                onOpen={(id) => openFolder(id, folder.name)}
                                                onDeleted={handleSidebarFolderDeleted}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : activeFolder ? (
                        <div>
                            <div className="drive-content-header">
                                <h2 className="drive-heading">{activeFolder.name}</h2>
                                <button className="btn btn-primary btn-sm" onClick={() => setShowUpload(true)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="16 16 12 12 8 16" />
                                        <line x1="12" y1="12" x2="12" y2="21" />
                                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                    </svg>
                                    Upload
                                </button>
                            </div>

                            {hasChildren && (
                                <div>
                                    <p className="section-label">Folders</p>
                                    <div className="folder-list">
                                        {activeFolder.children.map((child) => (
                                            <FolderNode
                                                key={child._id}
                                                folder={child}
                                                onOpen={(id) => openFolder(id, child.name)}
                                                onDeleted={handleMainFolderDeleted}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <ImageGrid
                                images={activeFolder.images || []}
                                onDeleted={handleImageDeleted}
                            />

                            {!hasChildren && !hasImages && (
                                <div className="empty-state">
                                    <div className="empty-state-icon">
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                    <p className="empty-state-title">This folder is empty</p>
                                    <p className="empty-state-desc">
                                        Upload images or create subfolders to organize your content.
                                    </p>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button className="btn" onClick={() => setShowNewFolder(true)}>
                                            New folder
                                        </button>
                                        <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                                            Upload image
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </main>
            </div>

            {showNewFolder && (
                <NewFolderModal
                    parentId={activeFolderId}
                    onClose={() => setShowNewFolder(false)}
                    onCreated={handleFolderCreated}
                />
            )}
            {showUpload && activeFolderId && (
                <UploadModal
                    folderId={activeFolderId}
                    onClose={() => setShowUpload(false)}
                    onUploaded={handleImageUploaded}
                />
            )}
        </div>
    );
}