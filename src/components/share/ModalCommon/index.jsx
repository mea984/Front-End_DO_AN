import React from "react";
import { Modal } from "antd";
import styles from "./ModalCommon.module.scss";

function ModalCommon({
  title,
  isOpen,
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Hủy",
  showFooter = true,
  isLoading = false,
  children,
}) {
  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={isLoading} // loading ở nút OK
      centered
      footer={
        showFooter
          ? undefined // Sử dụng footer mặc định của Antd
          : null // Ẩn footer nếu không cần
      }
      className={styles.modal}>
      <div className={styles.content}>{children}</div>
    </Modal>
  );
}

export default ModalCommon;
