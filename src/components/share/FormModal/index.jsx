import React, { useEffect } from "react";
import { Form, Input, Button, Upload, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ModalCommon from "../ModalCommon";
import styles from "./FormModal.module.scss";

function FormModal({
  title = "Form nhập liệu",
  isOpen,
  isLoading = false,
  onSubmit, // callback nhận dữ liệu form khi submit
  onCancel,
  formFields = [],
  okText = "Submit",
  cancelText = "Đóng",
}) {
  const [form] = Form.useForm();

  // Reset form khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  // Xử lý submit form của Ant Design
  const onFinish = (values) => {
    if (onSubmit) onSubmit(values);
  };

  const renderField = (field) => {
    switch (field.type) {
      case "textarea":
        return <Input.TextArea placeholder={field.placeholder} />;
      case "upload":
        return (
          <Upload beforeUpload={() => false} multiple listType="text">
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        );
      default:
        return <Input placeholder={field.placeholder} />;
    }
  };

  // Hàm xử lý preview: nếu giá trị là file thì chỉ hiển thị tên file
  const processPreview = (values) => {
    const processed = {};
    Object.keys(values).forEach((key) => {
      const value = values[key];
      // Kiểm tra nếu là đối tượng File
      if (value instanceof File) {
        processed[key] = value.name;
      } else {
        processed[key] = value;
      }
    });
    return processed;
  };

  return (
    <ModalCommon
      title={title}
      isOpen={isOpen}
      isLoading={isLoading}
      onOk={() => form.submit()}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={styles["form-modal"]}>
        {formFields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            initialValue={field.initialValue || ""}
            label={field.label}
            rules={field.rules || []}>
            {renderField(field)}
          </Form.Item>
        ))}
      </Form>
    </ModalCommon>
  );
}

export default FormModal;
