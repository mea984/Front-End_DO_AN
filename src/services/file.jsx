import { apiUser } from "../config/User";

export const uploadFile = async (formData, collectionID) => {
  try {
    const response = await apiUser.post(
      `/api/files/upload?collectionID=${collectionID}`,
      formData
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const updateFile = async (fileID, data) => {
  try {
    const response = await apiUser.put(`/api/files/${fileID}`, data);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const deleteFile = async (fileID) => {
  try {
    const response = await apiUser.delete(`/api/files/${fileID}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const deleteFiles = async (filesId) => {
  try {
    // Gửi yêu cầu DELETE với body đúng format
    const response = await apiUser.delete("/api/files", {
      data: filesId, // Truyền đúng body trong data
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
