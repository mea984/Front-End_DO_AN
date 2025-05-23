import { useState, useEffect } from "react";
import {
  Dropdown,
  Avatar,
  Menu,
  Modal,
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
} from "antd";
import {
  SettingOutlined,
  LogoutOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { updateInfoUser, getCurrentUser } from "../../services/user";
import { useDispatch } from "react-redux";

import styles from "./UserDropdown.module.scss";
import { setUser } from "../../redux/action/userAction";

const UserDropdown = ({ user, onLogout, onUpdate }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [backgroundPreview, setBackgroundPreview] = useState(
    user?.background || ""
  );

  // Load dữ liệu vào form khi modal mở
  useEffect(() => {
    form.setFieldsValue({ ...user });
  }, [user, form]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields(); // Validate dữ liệu trước khi gửi

      setIsLoading(true); // Bắt đầu tải dữ liệu

      const formData = new FormData();
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("gender", values.gender);

      // Nếu có ảnh mới, thêm vào formData
      if (values.avatar && values.avatar?.file?.originFileObj) {
        formData.append("avatar", values.avatar?.file?.originFileObj); // Lấy file từ trường avatar
      }
      if (values.background && values.background?.file?.originFileObj) {
        formData.append("background", values.background?.file?.originFileObj); // Lấy file từ trường background
      }

      const response = await updateInfoUser(formData);

      if (response?.status !== 200) throw new Error("Cập nhật thất bại");

      message.success("Cập nhật thành công!");
      // onUpdate(); // Gọi hàm cập nhật dữ liệu bên ngoài (nếu có)
      // clear data form
      form.resetFields(); // Reset form sau khi cập nhật thành công

      const user = await getCurrentUser();

      if (user?.status === 200) {
        dispatch(setUser(user?.data, true));
      }

      setIsLoading(false); // Kết thúc tải dữ liệu
      setTimeout(() => {
        setIsModalVisible(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false); // Kết thúc tải dữ liệu
      message.error("Cập nhật không thành công!");
    }
  };

  const handleAvatarChange = ({ file, onSuccess, onError }) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ cho phép tải lên hình ảnh!");
      return onError();
    }

    setAvatarPreview(URL.createObjectURL(file));

    // Cập nhật giá trị vào form
    form.setFieldsValue({ avatar: file }); // Lưu file vào form để khi submit lấy được
    onSuccess();
  };

  const handleBackgroundChange = ({ file, onSuccess, onError }) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ cho phép tải lên hình ảnh!");
      return onError();
    }

    setBackgroundPreview(URL.createObjectURL(file));

    // Cập nhật giá trị vào form
    form.setFieldsValue({ background: file }); // Lưu file vào form để khi submit lấy được
    onSuccess();
  };

  const menu = (
    <Menu className={styles.dropdownMenu}>
      <Menu.Item key="user" disabled className={styles.userInfo}>
        <Avatar size={50} src={user?.avatar} className={styles.avatar} />
        <p className={styles.userName}>{user?.username}</p>
      </Menu.Item>
      <Menu.Item key="settings" className={styles.menuItem} onClick={showModal}>
        <SettingOutlined /> Cài đặt
      </Menu.Item>
      <Menu.Item key="logout" onClick={onLogout} className={styles.logoutBtn}>
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
        <div className={styles.userDropdown}>
          <Avatar size={30} src={user?.avatar} />
          <span className={styles.userName}>{user?.username}</span>
        </div>
      </Dropdown>

      <Modal
        title="Cập nhật thông tin"
        visible={isModalVisible}
        onCancel={handleCancel}
        centered
        footer={null}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
            ]}>
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}>
            <Select>
              <Select.Option value="NAM">Nam</Select.Option>
              <Select.Option value="NỮ">Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="avatar" label="Ảnh đại diện">
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              customRequest={handleAvatarChange}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("Chỉ có thể tải lên ảnh!");
                }
                return isImage;
              }}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div>Chọn ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="background" label="Ảnh bìa">
            <Upload
              name="background"
              listType="picture-card"
              showUploadList={false}
              customRequest={handleBackgroundChange}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("Chỉ có thể tải lên ảnh!");
                }
                return isImage;
              }}>
              {backgroundPreview ? (
                <img
                  src={backgroundPreview}
                  alt="avatar"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div>Chọn ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              onClick={handleUpdate}
              block>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserDropdown;
