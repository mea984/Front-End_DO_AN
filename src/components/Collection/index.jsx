import React, { useEffect, useState } from "react";
import styles from "./Collection.module.scss";
import Header from "../share/Header";
import classNames from "classnames";
import { Button, message, Popconfirm } from "antd";
import { CiCamera } from "react-icons/ci";
import { FaRegImages, FaRegFolder } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slice/userSlice";
import {
  getCollections,
  addCollection,
  deleteCollection,
} from "../../services/collection";
import { formatDateTime, formatSize } from "../../utils/regex";
import { DeleteOutlined } from "@ant-design/icons";
import FormModal from "../share/FormModal";
import { useNavigate } from "react-router-dom";

const options = [
  { label: "Tất cả", value: "Tất cả" },
  { label: "Từ A - Z", value: "Từ A - Z" },
  { label: "Mới nhất", value: "Mới nhất" },
  { label: "Theo kích thước", value: "Theo kích thước" },
];

function Collection() {
  const nav = useNavigate();
  const user = useSelector(selectUser);
  const [activeSortCollection, setActiveSortCollection] = useState("Tất cả");
  const [collections, setCollections] = React.useState([]);
  const [propsForm, setPropsForm] = useState({
    title: "Form nhập liệu",
    isOpen: false,
    onSubmit: null,
    onCancel: null,
    formFields: [],
    okText: "Xác nhận",
    cancelText: "Đóng",
  });

  const fetchingData = async () => {
    const response = await getCollections();
    if (response?.status === 200) {
      setCollections(response?.data);
    } else {
      message.error(response?.message);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const handleSubmidCreateAlbum = async (data) => {
    const { name } = data;
    if (!name) {
      message.error("Tên bộ sưu tập không được để trống");
      return;
    }
    const response = await addCollection(data);
    if (response?.status == 201) {
      message.success("Tạo bộ sưu tập thành công");
      fetchingData();
      setPropsForm((prev) => ({ ...prev, isOpen: false }));
    } else if (response?.status === 409) {
      message.error("Bộ sưu tập đã tồn tại");
    } else {
      message.error("Có lỗi xảy ra trong quá trình tạo bộ sưu tập");
    }
  };
  const handleCreateAlbum = () => {
    setPropsForm((prev) => ({
      ...prev,
      isOpen: true,
      title: "Tạo bộ sưu tập mới",
      formFields: [
        {
          label: "Tên",
          name: "name",
          type: "text",
          placeholder: "Nhập tên bộ sưu tập...",
        },
        {
          label: "Mô tả",
          name: "description",
          type: "textarea",
          placeholder: "Nhập mô tả...",
        },
      ],
      onSubmit: handleSubmidCreateAlbum,
      onCancel: () => setPropsForm((prev) => ({ ...prev, isOpen: false })),
    }));
  };

  const handleDeleteFolder = async (id) => {
    const response = await deleteCollection(id);

    if (response?.status === 204) {
      message.success("Xóa bộ sưu tập thành công");
      fetchingData();
    } else {
      message.error(response?.message);
    }
  };

  const handleChangeSortCollection = (value) => {
    setActiveSortCollection(value);
    switch (value) {
      case "Từ A - Z":
        setCollections((prev) =>
          [...prev].sort((a, b) => a.name.localeCompare(b.name))
        );
        break;
      case "Mới nhất":
        setCollections((prev) =>
          [...prev].sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
        );
        break;
      case "Theo kích thước":
        setCollections((prev) =>
          [...prev].sort(
            (a, b) =>
              a.files.reduce((sum, file) => sum + file.fileSize, 0) -
              b.files.reduce((sum, file) => sum + file.fileSize, 0)
          )
        );
        break;
      default:
        fetchingData();
    }
  };

  const handleActiveCollectionDetail = (collectionId) => {
    nav(`/collection/${collectionId}`);
  };

  return (
    <>
      <Header />
      <div className={styles.detail_file}>
        <div className={styles.detail_file__backgroud}>
          <img src={user?.background || ""} alt="" />
        </div>
        <div className={styles.detail_file__content}>
          <div className={styles.detail_file__content__left}>
            <div className={styles.detail_file__content__left__avatar}>
              <img src={user?.avatar || ""} alt="" />
            </div>
            <div className={styles.detail_file__content__left__info}>
              <div className={styles.detail_file__content__left__name}>
                <h2>{user?.username || ""}</h2>
              </div>
              <div
                className={
                  styles.detail_file__content__left__quantity_collection
                }>
                <span>{collections.length || 0}</span>
                <span>Bộ sưu tập</span>
              </div>
            </div>
          </div>
          <div className={styles.detail_file__content__right}>
            <Button
              onClick={handleCreateAlbum}
              icon={<FaRegImages />}
              className={styles.detail_file__content__right__btn}>
              Create new album
            </Button>
          </div>
        </div>

        <div className={styles.detail_file__data}>
          <ul className={styles.detail_file__data__head}>
            {options.map((option) => (
              <li
                onClick={() => handleChangeSortCollection(option.value)}
                key={option.value}
                className={classNames(
                  styles.detail_file__data__head__item,
                  option.value === activeSortCollection
                    ? styles.detail_file__data__head__item__active
                    : ""
                )}>
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
          <div className={styles.detail_file__data__list}>
            {collections && collections.length <= 0 ? (
              <div className={styles.detail_file__data__list__empty}>
                <h2>Chưa có bộ sưu tập nào</h2>
              </div>
            ) : (
              collections?.map((collection) => (
                <div className={styles.detail_file__data__item}>
                  <FaRegFolder
                    className={styles.detail_file__data__item__icon}
                  />
                  <div
                    className={styles.detail_file__data__item__info}
                    onClick={() => handleActiveCollectionDetail(collection.id)}>
                    <span className={styles.detail_file__data__item__name}>
                      {collection?.name || ""}
                    </span>
                    <span className={styles.detail_file__data__item__quantity}>
                      Tổng số files: {collection?.files?.length || 0}
                    </span>
                    <span className={styles.detail_file__data__item__size}>
                      Kích thước:{" "}
                      {formatSize(
                        collection?.files.reduce(
                          (sum, file) => sum + file.fileSize,
                          0
                        )
                      )}
                    </span>
                    <span className={styles.detail_file__data__item__date}>
                      Ngày tạo: {formatDateTime(collection?.createAt) || ""}
                    </span>
                  </div>
                  <Popconfirm
                    title="Bạn có chắc muốn xóa mục này?"
                    onConfirm={() => handleDeleteFolder(collection.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    placement="topRight"
                    icon={<DeleteOutlined style={{ color: "red" }} />}
                    okButtonProps={{ danger: true }}>
                    <MdDelete
                      className={styles.detail_file__data__item__delete}
                      style={{ cursor: "pointer", color: "#ff4d4f" }}
                      size={26}
                    />
                  </Popconfirm>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <FormModal {...propsForm} />
    </>
  );
}

export default Collection;
