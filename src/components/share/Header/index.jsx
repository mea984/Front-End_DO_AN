import React from "react";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { BsQuestionCircle } from "react-icons/bs";
import { FaLanguage, FaChevronDown, FaCloudUploadAlt } from "react-icons/fa";
import { LuLogIn } from "react-icons/lu";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import { selectUser } from "../../../redux/slice/userSlice";
import { selectIsLogin } from "../../../redux/slice/userSlice";
import UserDropdown from "../../UserDropdown";
import { logout } from "../../../redux/action/userAction";

function Header() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector(selectIsLogin);
  const user = useSelector(selectUser);

  const onLogout = () => {
    dispatch(logout());
    nav("/login");
  };

  return (
    <header className={styles.header}>
      <ul className={styles.header__nav}>
        {isLogin && (
          <li className={styles.header__nav__item}>
            <BsQuestionCircle />
            <Link>Giới thiệu</Link>
          </li>
        )}
        {isLogin && (
          <li className={styles.header__nav__item}>
            <FaLanguage />
            <Link>
              VI <FaChevronDown />
            </Link>
          </li>
        )}

        <li className={classNames(styles.header__nav__item, "flex-1")}>
          <Link to={"/"}>
            <img src="https://simgbb.com/images/logo.png" alt="Logo" />
          </Link>
        </li>

        {isLogin && (
          <>
            <li className={styles.header__nav__item}>
              <UserDropdown user={user} onLogout={onLogout} />
            </li>
          </>
        )}

        {isLogin == true ? (
          ""
        ) : (
          <>
            <li className={styles.header__nav__item}>
              <LuLogIn />
              <Link to={"/login"}>Đăng nhập</Link>
            </li>
            <li className={styles.header__nav__item}>
              <Link
                to={"/register"}
                className="h-[32px] w-[80px] text-[#fff] bg-[#23a8e0] rounded-xs hover:opacity-80 transition-opacity duration-300">
                Đăng Ký
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
