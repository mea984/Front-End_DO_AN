import { apiUser } from "../config/User";

export const getCollections = async () => {
  try {
    const response = await apiUser.get("/api/v1/collection/collections");
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getCollectionById = async (Id) => {
  try {
    const response = await apiUser.get(`/api/v1/collection/${Id}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const addCollection = async (body) => {
  try {
    const response = await apiUser.post("/api/v1/collection", body);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const putCollection = async (body, id_Collection) => {
  try {
    const response = await apiUser.put(
      `/api/v1/collection/${id_Collection}`,
      body
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const deleteCollection = async (id_Collection) => {
  try {
    const response = await apiUser.delete(
      `/api/v1/collection/${id_Collection}`
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
