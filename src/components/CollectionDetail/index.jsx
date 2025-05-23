import React, { useEffect, useState } from "react";
import Header from "../share/Header";
import styles from "./CollectionDetail.module.scss";
import { Button, message, Popconfirm, Modal } from "antd";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import classNames from "classnames";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slice/userSlice";
import {
  getCollectionById,
  putCollection,
  deleteCollection,
} from "../../services/collection";
import FormModal from "../share/FormModal";
import { DeleteOutlined } from "@ant-design/icons";
import FileViewer from "../share/FileViewer";
import {
  deleteFile,
  deleteFiles,
  updateFile,
  uploadFile,
} from "../../services/file";
const options = [
  { label: "Tất cả", value: "Tất cả" },
  { label: "Mới nhất", value: "Mới nhất" },
  { label: "Theo kích thước tăng dần", value: "Theo kích thước tăng dần" },
  { label: "Theo kích thước giảm dần", value: "Theo kích thước giảm dần" },
];

function CollectionDetail() {
  const nav = useNavigate();
  const { id } = useParams();

  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [visible, setVisible] = useState(false);
  const [fileData, setFileData] = useState(null);

  const toggleFileSelection = (fileId) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDeleteSelected = async () => {
    const response = await deleteFiles({
      fileIds: selectedFileIds,
    });
    if (response?.status === 200) {
      message.success("Xóa file thành công");
      fetchingApi();
    } else {
      message.error(response?.message);
    }

    setSelectedFileIds([]); // Clear sau khi xóa
  };
  const [propsForm, setPropsForm] = useState({
    title: "Form nhập liệu",
    isOpen: false,
    onSubmit: null,
    onCancel: null,
    formFields: [],
    okText: "Xác nhận",
    cancelText: "Đóng",
  });

  const [activeSortCollection, setActiveSortCollection] = useState("Tất cả");
  const [collection, setCollection] = useState({});
  const fetchingApi = async () => {
    const response = await getCollectionById(id);
    if (response?.status === 200) {
      setCollection(response?.data);
    } else {
      message.error(response?.message);
    }
  };
  useEffect(() => {
    fetchingApi();
  }, []);

  const user = useSelector(selectUser);
  const handleChangeSortCollection = (value) => {
    setActiveSortCollection(value);

    switch (value) {
      case "Tất cả":
        setCollection((prev) => ({
          ...prev,
          files: prev?.files?.sort((a, b) => a.id - b.id),
        }));
        break;
      case "Mới nhất":
        setCollection((prev) => ({
          ...prev,
          files: prev?.files?.sort((a, b) => b.id - a.id),
        }));
        break;
      case "Theo kích thước tăng dần":
        setCollection((prev) => ({
          ...prev,
          files: prev?.files?.sort((a, b) => a.fileSize - b.fileSize),
        }));
        break;
      case "Theo kích thước giảm dần":
        setCollection((prev) => ({
          ...prev,
          files: prev?.files?.sort((a, b) => b.fileSize - a.fileSize),
        }));
        break;

      default:
        fetchingApi();
    }
  };

  const handleSubmidUpdateCollection = async (data) => {
    if (!data.name) {
      message.error("Tên bộ sưu tập không được để trống");
      return;
    }
    setPropsForm((prev) => ({ ...prev, isLoading: true }));
    const response = await putCollection(data, collection?.id);
    if (response?.status === 200) {
      message.success("Cập nhật bộ sưu tập thành công");
      fetchingApi();
      setPropsForm((prev) => ({ ...prev, isOpen: false }));
    } else {
      message.error(response?.message);
    }
    setPropsForm((prev) => ({ ...prev, isLoading: false }));
  };

  const handleUpdateCollection = () => {
    setPropsForm({
      title: "Cập nhật bộ sưu tập",
      isOpen: true,
      onSubmit: handleSubmidUpdateCollection,
      onCancel: () => setPropsForm((prev) => ({ ...prev, isOpen: false })),
      formFields: [
        {
          name: "name",
          label: "Tên bộ sưu tập",
          type: "input",
          placeholder: "Nhập tên bộ sưu tập",
          initialValue: collection?.name || "",
        },
        {
          name: "description",
          label: "Mô tả",
          type: "textarea",
          placeholder: "Nhập mô tả",
          initialValue: collection?.description || "",
        },
      ],
    });
  };

  const handleDeleteColection = async (id) => {
    const response = await deleteCollection(id);
    if (response?.status === 204) {
      message.success("Xóa bộ sưu tập thành công");
      nav("/collection");
    } else {
      message.error(response?.message);
    }
  };
  const handleOnEditFile = (file) => {
    setPropsForm({
      title: "Cập nhật file",
      isOpen: true,
      onSubmit: (data) => handleSubmidUpdateFile(data, file),
      onCancel: () => setPropsForm((prev) => ({ ...prev, isOpen: false })),
      formFields: [
        {
          name: "name",
          label: "Tên file",
          type: "input",
          placeholder: "Nhập tên file",
          initialValue: file?.fileName || "",
        },
      ],
    });
  };

  const handleOnInfoFile = (file) => {
    setFileData(file);
    setVisible(true);
  };

  const handleOnDeleteFile = async (fileID) => {
    setPropsForm((prev) => ({ ...prev, isLoading: true }));
    const response = await deleteFile(fileID);

    if (response?.status === 200) {
      message.success("Xóa file thành công");
      fetchingApi();
    } else if (response?.status === 404) {
      message.error("File không tồn tại");
    } else {
      message.error(response?.message);
    }
    setPropsForm((prev) => ({ ...prev, isLoading: false }));
  };

  const handleSubmidUpdateFile = async (data, file) => {
    console.log("Check file", file);

    if (!data.name) {
      message.error("Tên file không được để trống");
      return;
    }
    setPropsForm((prev) => ({ ...prev, isLoading: true }));
    const response = await updateFile(file?.id, {
      fileName: data.name || "",
    });
    if (response?.status === 200) {
      message.success("Cập nhật file thành công");
      fetchingApi();
      setPropsForm((prev) => ({ ...prev, isOpen: false }));
    } else {
      message.error(response?.message);
    }
    setPropsForm((prev) => ({ ...prev, isLoading: false }));
  };

  const handleSubmidUploadFileToCollection = async (data) => {
    console.log("Check data", data);

    const formData = new FormData();

    const list_file_ = data?.file?.fileList?.map((item) => item.originFileObj);

    if (!list_file_ || list_file_.length <= 0) {
      message.error("Vui lòng chọn file để tải lên");
      return;
    }
    if (list_file_.length > 50) {
      message.error("Chỉ được tải lên tối đa 50 file");
      return;
    }

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    for (let file of list_file_) {
      console.log(file);
      
      if (file.size > MAX_FILE_SIZE) {
        message.error(
          `File "${file.name}" vượt quá dung lượng cho phép (50MB)`
        );
        return;
      }
    }

    list_file_?.forEach((file) => {
      formData.append("file", file); // Thêm từng file vào FormData
    });

    setPropsForm((prev) => ({ ...prev, isLoading: true }));
    const response = await uploadFile(formData, collection?.id);

    if (response?.status === 200) {
      message.success("Tải file lên bộ sưu tập thành công");
      fetchingApi();
      setPropsForm((prev) => ({ ...prev, isOpen: false }));
    } else if (response?.status == 409) {
      message.error(response?.data);
    } else {
      message.error(response?.message || "Đã có lỗi xảy ra");
    }
    setPropsForm((prev) => ({ ...prev, isLoading: false }));
  };

  const handleUploadFileToCollection = () => {
    setPropsForm({
      title: "Tải file lên bộ sưu tập",
      isOpen: true,
      onSubmit: handleSubmidUploadFileToCollection,
      onCancel: () => setPropsForm((prev) => ({ ...prev, isOpen: false })),
      okText: "Xác nhận",
      formFields: [
        {
          name: "file",
          label: "Tải file một hoặc nhiều lên",
          type: "upload",
          placeholder: "Nhập tên bộ sưu tập",
        },
      ],
    });
  };

  return (
    <>
      <Header />
      <div className={styles.collection_detail}>
        <div className={styles.collection_detail__left}>
          <div className={styles.collection_detail__left__info}>
            <div className={styles.collection_detail__left__info__account}>
              <img src={user?.avatar || ""} alt="" />
              <strong
                className={styles.collection_detail__left__info__account__name}>
                {user?.username || ""}
              </strong>
            </div>

            <p className={styles.collection_detail__left__info__title}>
              {collection?.name || ""}
            </p>
            <p className={styles.collection_detail__left__info__description}>
              {collection?.description || ""}
            </p>
            <p className={styles.collection_detail__left__info__quantity_image}>
              {collection?.files?.length || 0} file Trong bộ sưu tập
            </p>
          </div>
          <div className={styles.collection_detail__left__action}>
            <Button
              icon={<FaEdit />}
              className={styles.collection_detail__left__edit}
              onClick={handleUpdateCollection}>
              Cập nhật bộ sưu tập
            </Button>

            <Popconfirm
              title="Bạn có chắc muốn xóa mục này?"
              onConfirm={() => handleDeleteColection(collection.id)}
              okText="Xóa"
              cancelText="Hủy"
              placement="topRight"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              okButtonProps={{ danger: true }}>
              <Button
                icon={<MdDelete />}
                className={styles.collection_detail__left__delete}>
                Xóa bộ sưu tập
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Bạn có chắc muốn xóa mục này?"
              onConfirm={handleDeleteSelected}
              okText="Xóa"
              cancelText="Hủy"
              placement="topRight"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              okButtonProps={{ danger: true }}>
              <Button
                icon={<MdDelete />}
                className={styles.collection_detail__left__edit}>
                Xóa {selectedFileIds.length || ""} file đã chọn
              </Button>
            </Popconfirm>
          </div>
        </div>
        <div className={styles.collection_detail__right}>
          <Button
            className={styles.collection_detail__right__btn_upload}
            icon={<FaCloudUploadAlt />}
            onClick={handleUploadFileToCollection}>
            Tải file vào bộ sưu tập
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
          {collection?.files?.length <= 0 ? (
            <div className={styles.detail_file__data__list__empty}>
              <h2>Chưa có file nào</h2>
            </div>
          ) : (
            collection?.files?.map((file) => (
              <div className={styles.detail_file__data__item} key={file?.id}>
                <FileViewer
                  file={file}
                  fileId={file?.id || ""}
                  fileName={file?.fileName || ""}
                  fileType={file?.fileType || ""}
                  fileUrl={file?.cloudinaryUrl || ""}
                  onDelete={handleOnDeleteFile}
                  onEdit={handleOnEditFile}
                  onInfo={handleOnInfoFile}
                  isSelected={selectedFileIds.includes(file.id)}
                  onSelectChange={toggleFileSelection}
                />
              </div>
            ))
          )}
        </div>
      </div>
      <FormModal {...propsForm} />

      <Modal
        title="Thông tin chi tiết file"
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        width={600}
        className={styles.fileViewerModal} // Apply the CSS Module class here
      >
        <div className={styles.fileDetail}>
          {" "}
          {/* Apply the CSS Module class here */}
          <p>
            <strong>Tên file:</strong> {fileData?.fileName}
          </p>
          <p>
            <strong>Loại file:</strong> {fileData?.fileType}
          </p>
          <p>
            <strong>Kích thước file:</strong> {fileData?.fileSize} bytes
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(fileData?.createAt).toLocaleString()}
          </p>
        </div>
        <div className={styles.modalFooter}>
          {" "}
          {/* Apply the CSS Module class here */}
          <Button onClick={() => setVisible(false)}>Đóng</Button>
        </div>
      </Modal>
    </>
  );
}
export default CollectionDetail;
