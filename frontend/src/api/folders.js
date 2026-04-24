import client from "./client";

export const getFolders = () => client.get("/api/folders");

export const getFolder = (id) => client.get(`/api/folders/${id}`);

export const createFolder = (name, parentId) =>
  client.post("/api/folders", { name, parentId });

export const renameFolder = (id, name) =>
  client.patch(`/api/folders/${id}`, { name });

export const deleteFolder = (id) => client.delete(`/api/folders/${id}`);