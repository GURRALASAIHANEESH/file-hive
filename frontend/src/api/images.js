import client from "./client";

export const uploadImage = (name, folderId, file) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("folderId", folderId);
    formData.append("image", file);
    return client.post("/api/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const deleteImage = (id) => client.delete(`/api/images/${id}`);