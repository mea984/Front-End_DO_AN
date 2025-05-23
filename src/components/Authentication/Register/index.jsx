import React, { useState, useEffect } from "react";
import styles from "./Register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Modal } from "antd";
import { IoLogoFacebook } from "react-icons/io5";
import { FaGithub, FaGoogle } from "react-icons/fa";
import classNames from "classnames";
import { validateEmail } from "../../../utils/regex";
import { showToast } from "../../../utils/toast";
import {
  apiRegister,
  apiVerifyOtpRegister,
  oauthLogin,
} from "../../../services/auth-service";

import Cookies from "js-cookie";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../../helper/filebase";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../../services/user";
import { setUser } from "../../../redux/action/userAction";
import { selectIsLogin } from "../../../redux/slice/userSlice";

function Register() {
  const navigate = useNavigate();
  const isLogin = useSelector(selectIsLogin);
  const dispatch = useDispatch();

  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [register, setRegister] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate]);

  const onChange = (text) => {
    setOtp(text);
  };
  const sharedProps = {
    onChange,
  };

  const handleOnChangeRegister = (e) => {
    const { name, value } = e.target;
    setRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterModalClose = () => {
    setIsModalOpen(false);

    setRegister({
      email: "",
      username: "",
      password: "",
    });
  };

  const [timeLeft, setTimeLeft] = useState(90); // 90s đếm ngược

  useEffect(() => {
    if (!isModalOpen) {
      setTimeLeft(90); // Reset thời gian khi mở lại modal
      return;
    }

    if (timeLeft === 0) {
      handleRegisterModalClose(); // Tự động đóng modal khi hết thời gian
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer); // Cleanup khi component unmount
  }, [isModalOpen, timeLeft, handleRegisterModalClose]);

  const handleRegister = async () => {
    if (!validateEmail(register.email)) {
      showToast.error("Email không hợp lệ");
      return;
    }
    if (register.username === "" || register.username.length < 6) {
      showToast.error(
        "Tên người dùng không hợp lệ. Tên người dùng tối thiểu 6 ký tự"
      );
      return;
    }
    if (register.password === "" || register.password.length < 6) {
      showToast.error("Mật khẩu không hợp lệ. Mật khẩu tối thiểu 6 ký tự");
      return;
    }
    setIsLoadingRegister(true);

    const response = await apiRegister(register);
    if (response?.status === 200) {
      showToast.success(
        "Gửi yêu cầu đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP và xác nhận tài khoản"
      );
      setIsLoadingRegister(false);

      setIsModalOpen(true);
    } else {
      showToast.error(response?.message);
    }
    setIsLoadingRegister(false);
  };

  const handleSubmidRegisterOTP = async () => {
    if (otp === "" || otp.length < 6) {
      showToast.error("Mã OTP không hợp lệ");
      return;
    }
    setIsLoadingModal(true);
    const dataOtp = {
      email: register.email,
      otp: otp,
    };
    const response = await apiVerifyOtpRegister(dataOtp);
    if (response?.status === 200) {
      showToast.success("Xác nhận tài khoản thành công");
      setIsModalOpen(false);
    } else {
      showToast.error(response?.message);
    }

    setRegister({
      email: "",
      username: "",
      password: "",
    });
    setIsLoadingModal(false);
  };

  const handleLoginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const id_token = await result.user.getIdToken();

        const provider = result.providerId;
        const email = result.user.email;
        const username = result.user.displayName;
        const avatar = result.user.photoURL;
        const data = {
          id_token,
          provider,
          email,
          username,
          avatar,
        };

        const response = await oauthLogin(data);

        console.log("Check response", response);

        if (response?.status === 200) {
          const { accessToken, refreshToken, userId } = response;

          Cookies.set("accessToken", accessToken, { expires: 1 / 24 }); // 1 giờ
          Cookies.set("refreshToken", refreshToken, { expires: 14 }); // 14 ngày
          const user = await getCurrentUser(userId);
          if (user?.status === 200) {
            dispatch(setUser(user?.data, true));
          }
          setTimeout(() => {
            showToast.success("Đăng nhập thành công");
          }, 1000);
        } else {
          showToast.error(
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin"
          );
        }
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          showToast.error(
            "Tài khoản đã tồn tại với nhà cung cấp khác. Vui lòng thử lại với tài khoản khác."
          );
        } else {
          showToast.error(
            "Đã xảy ra lỗi bất ngờ khi đăng nhập. Vui lòng thử lại sau"
          );
        }
      });
  };
  const handleLoginGithub = async () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const id_token = await result.user.getIdToken();
        const provider = result.providerId;
        const email = result.user.email;
        const username = result.user.displayName;
        const avatar = result.user.photoURL;
        const data = {
          id_token,
          provider,
          email,
          username,
          avatar,
        };

        const response = await oauthLogin(data);
        console.log("Check response", response);

        if (response?.status === 200) {
          const { accessToken, refreshToken, userId } = response;

          Cookies.set("accessToken", accessToken, { expires: 1 / 24 }); // 1 giờ
          Cookies.set("refreshToken", refreshToken, { expires: 14 }); // 14 ngày
          const user = await getCurrentUser(userId);

          if (user?.status === 200) {
            dispatch(setUser(user?.data, true));
          }
          setTimeout(() => {
            showToast.success("Đăng nhập thành công");
          }, 1000);
        } else {
          showToast.error(
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin"
          );
        }
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          showToast.error(
            "Tài khoản đã tồn tại với nhà cung cấp khác. Vui lòng thử lại với tài khoản khác."
          );
        } else {
          showToast.error(
            "Đã xảy ra lỗi bất ngờ khi đăng nhập. Vui lòng thử lại sau"
          );
        }
      });
  };

  return (
    <>
      <div className={styles.containner__register}>
        <div className={styles.containner__register__left}>
          <h1 className={styles.containner__register__left__title}>Đăng Ký</h1>
          <div className={styles.containner__register__left__form}>
            <div className={styles.containner__register__left__form__item}>
              <label htmlFor="">Email</label>
              <Input
                name="email"
                className="h-10 px-3 py-2"
                placeholder="Nhập vào email..."
                onChange={handleOnChangeRegister}
                value={register.email}
              />
            </div>
            <div className={styles.containner__register__left__form__item}>
              <label htmlFor="">Tên người dùng</label>
              <Input
                name="username"
                className="h-10 px-3 py-2"
                placeholder="Nhập vào tên người dùng..."
                onChange={handleOnChangeRegister}
                value={register.username}
              />
            </div>
            <div className={styles.containner__register__left__form__item}>
              <label htmlFor="">Mật khẩu</label>
              <Input.Password
                name="password"
                className="h-10 px-3 py-2"
                placeholder="Nhập vào mật khẩu..."
                onChange={handleOnChangeRegister}
                value={register.password}
              />
            </div>
            <p
              className={
                styles.containner__register__left__form__forgot_pasword
              }>
              <Link to={"/forgot-password"}>Quên mật khẩu?</Link>
            </p>
            <div
              className={classNames(
                styles.containner__register__left__form__btnLogin
              )}>
              <Button loading={isLoadingRegister} onClick={handleRegister}>
                Đăng Ký
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.containner__register__center}>
          <strong className={styles.containner__register__center__title}>
            Hoặc
          </strong>
        </div>
        <div className={styles.containner__register__right}>
          <h2 className={styles.containner__register__right__title}>
            Đăng nhập bằng
          </h2>
          <div className={styles.containner__register__right__service}>
            <div
              onClick={handleLoginGithub}
              className={classNames(
                styles.containner__register__right__service__item,
                "bg-[var(--bg-github)]"
              )}>
              <FaGithub />
              <span
                className={
                  styles.containner__register__right__service__item__title
                }>
                Github
              </span>
            </div>
            <div
              onClick={handleLoginGoogle}
              className={classNames(
                styles.containner__register__right__service__item,
                "bg-[var(--bg-google)]"
              )}>
              <FaGoogle />
              <span
                className={
                  styles.containner__register__right__service__item__title
                }>
                Google
              </span>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={
          <h2 className="text-xl font-semibold text-gray-800">
            Nhập vào mã OTP
          </h2>
        }
        centered
        footer={null}
        open={isModalOpen}
        onCancel={handleRegisterModalClose}
        className="rounded-2xl p-6">
        <div className="flex flex-col items-center gap-4">
          <Input.OTP
            className="border border-gray-300 rounded-lg p-2 text-lg focus:ring-2 focus:ring-blue-500 w-full"
            {...sharedProps}
            value={otp}
          />
          <p className="text-gray-600 text-sm">
            Mã OTP hết hạn sau:{" "}
            <span className="font-semibold text-red-500">{timeLeft}s</span>
          </p>
          <Button
            loading={isLoadingModal}
            type="primary"
            onClick={handleSubmidRegisterOTP}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all">
            Xác nhận
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Register;
