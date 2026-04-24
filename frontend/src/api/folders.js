import client from "./client";

export const getFolders = () => client.get("/folders");

export const getFolder = (id) => client.get(`/folders/${id}`);

export const createFolder = (name, parentId) =>
    client.post("/folders", { name, parentId });

export const deleteFolder = (id) => client.delete(`/folders/${id}`);