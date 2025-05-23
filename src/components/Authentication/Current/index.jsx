import React from "react";
import styles from "./Current.module.scss";
import { Button } from "antd";
import classNames from "classnames";
import FileViewer from "../../share/FileViewer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLogin } from "../../../redux/slice/userSlice";

function Current() {
  const isLogin = useSelector(selectIsLogin);
  const nav = useNavigate();
  const handleStartNow = () => {
    if (isLogin) {
      nav("/collection");
    } else {
      nav("/login");
    }
  };

  return (
    <>
      <div className={styles.current__container}>
        <h1 className={styles.current__container__title}>
          Quản lý, lưu trữ tất cả tài liệu của bạn một cách dễ dàng
        </h1>
        <p className={styles.current__container__desc}>
          Kéo và thả tài liệu của bạn vào đây để bắt đầu tải lên. Giới hạn dung
          lượng 50MB. Cung cấp chế độ preview cho các định dạng tài liệu phổ
          biến như PDF, DOCX, XLSX, PPTX và nhiều định dạng khác.
        </p>
        <Button
          onClick={handleStartNow}
          className={styles.current__container__btn_start_now}>
          Bắt đầu ngay
        </Button>
        <div className={styles.current__container__option_pro}>
          <h1 className={styles.current__container__title}>
            Tài khoản ImgBB Pro
          </h1>
          <p className={styles.current__container__desc}>
            ImgBB là dịch vụ lưu trữ hình ảnh miễn phí. Nâng cấp lên Pro để mở
            khóa tất cả các tính năng.
          </p>
          <div className={styles.current__container__option_pro__pakage}>
            <div
              className={styles.current__container__option_pro__pakage__item}>
              <p
                className={
                  styles.current__container__option_pro__pakage__item_time
                }>
                GÓI PRO 3 NĂM
              </p>
              <strong
                className={
                  styles.current__container__option_pro__pakage__item__price
                }>
                2.99$/tháng
              </strong>
              <p
                className={
                  styles.current__container__option_pro__pakage__item_desc
                }>
                3 năm lưu trữ hình ảnh và tài liệu không giới hạn, không có
                quảng cáo và không có giới hạn.
              </p>
              <Button
                className={
                  styles.current__container__option_pro__pakage__item_btn
                }>
                Nâng cấp lên Pro
              </Button>
              <ul
                className={
                  styles.current__container__option_pro__pakage__item__fuc
                }>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Không có quảng cáo
                </li>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Liên kết trực tiếp
                </li>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Lưu trữ không giới hạn
                </li>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Tính năng thay thế hình ảnh
                </li>
              </ul>
            </div>
            <div
              className={styles.current__container__option_pro__pakage__item}>
              <p
                className={
                  styles.current__container__option_pro__pakage__item_time
                }>
                GÓI PRO 3 NĂM
              </p>
              <strong
                className={
                  styles.current__container__option_pro__pakage__item__price
                }>
                2.99$/tháng
              </strong>
              <p
                className={
                  styles.current__container__option_pro__pakage__item_desc
                }>
                3 năm lưu trữ hình ảnh và tài liệu không giới hạn, không có
                quảng cáo và không có giới hạn.
              </p>
              <Button
                className={
                  styles.current__container__option_pro__pakage__item_btn
                }>
                Nâng cấp lên Pro
              </Button>
              <ul
                className={
                  styles.current__container__option_pro__pakage__item__fuc
                }>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Không có quảng cáo
                </li>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Liên kết trực tiếp
                </li>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Lưu trữ không giới hạn
                </li>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Tính năng thay thế hình ảnh
                </li>
              </ul>
            </div>
            <div
              className={styles.current__container__option_pro__pakage__item}>
              <p
                className={
                  styles.current__container__option_pro__pakage__item_time
                }>
                GÓI PRO 3 NĂM
              </p>
              <strong
                className={
                  styles.current__container__option_pro__pakage__item__price
                }>
                2.99$/tháng
              </strong>
              <p
                className={
                  styles.current__container__option_pro__pakage__item_desc
                }>
                3 năm lưu trữ hình ảnh và tài liệu không giới hạn, không có
                quảng cáo và không có giới hạn.
              </p>
              <Button
                className={
                  styles.current__container__option_pro__pakage__item_btn
                }>
                Nâng cấp lên Pro
              </Button>
              <ul
                className={
                  styles.current__container__option_pro__pakage__item__fuc
                }>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Không có quảng cáo
                </li>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Liên kết trực tiếp
                </li>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Lưu trữ không giới hạn
                </li>
                <li
                  className={
                    styles.current__container__option_pro__pakage__item__fuc__title
                  }>
                  Tính năng thay thế hình ảnh
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Current;
