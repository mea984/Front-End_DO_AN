import axios from "axios";

export const apiRegister = async (dataRegister) => {
  try {
    const response = await axios.post(
      "https://codezen.io.vn/auth/register",
      dataRegister
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const apiVerifyOtpRegister = async (dataOtp) => {
  try {
    const response = await axios.post(
      "https://codezen.io.vn/auth/verify-otp-register",
      dataOtp
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const apiForgotPassword = async (dataForgotPassword) => {
  try {
    const response = await axios.post(
      "https://codezen.io.vn/auth/forgot-password",
      dataForgotPassword
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const apiVerifyOtpForgotPassword = async (dataOtp) => {
  try {
    const response = await axios.post(
      "https://codezen.io.vn/auth/verify-otp-forgot-password",
      dataOtp
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const apiLogin = async (dataLogin) => {
  try {
    const response = await axios.post(
      "https://codezen.io.vn/auth/access",
      dataLogin
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const oauthLogin = async (dataLogin) => {
  try {
    const response = await axios.post(
      "https://codezen.io.vn/auth/oauth/login",
      dataLogin
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
