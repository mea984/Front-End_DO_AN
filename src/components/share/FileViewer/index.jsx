import React, { useState } from "react";
import styles from "./FileViewer.module.scss";
import { Button } from "antd";
import {
  FaDownload,
  FaTrash,
  FaEdit,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import { DeleteOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { handlePreview } from "../../../utils/regex";

const FileViewer = ({
  file,
  fileId,
  fileUrl,
  fileType,
  fileName,
  onDelete,
  onEdit,
  onInfo,
  isSelected,
  onSelectChange,
}) => {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const getExtension = (url) => {
    const parts = url.split(".");
    return parts.length > 0 ? parts.pop().toLowerCase() : "";
  };

  const extension = fileType ? fileType : getExtension(fileUrl);
  const getDownloadUrl = (fileUrl) => {
    if (!fileUrl) return "#";
    try {
      const url = new URL(fileUrl);
      const parts = url.pathname.split("/upload/");
      // Chuyển sang link dạng fl_attachment đúng chuẩn
      return `${url.origin}${parts[0]}/upload/fl_attachment/${parts[1]}`;
    } catch (err) {
      return fileUrl;
    }
  };

  const renderActions = () => (
    <div className={styles.actions}>
      {onInfo && (
        <button onClick={() => onInfo(file)} className={styles.iconButton}>
          <FaInfoCircle />
        </button>
      )}
      {onEdit && (
        <button onClick={() => onEdit(file)} className={styles.iconButton}>
          <FaEdit />
        </button>
      )}
      {onDelete && (
        <Popconfirm
          title="Bạn có chắc muốn xóa mục này?"
          onConfirm={() => onDelete(fileId)}
          okText="Xóa"
          cancelText="Hủy"
          placement="topRight"
          icon={<DeleteOutlined style={{ color: "red" }} />}
          okButtonProps={{ danger: true }}>
          <button className={styles.iconButton}>
            <FaTrash />
          </button>
        </Popconfirm>
      )}
    </div>
  );

  const renderCheckbox = () => (
    <div className={styles.checkboxWrapper}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelectChange(fileId)}
      />
    </div>
  );

  const renderFooter = () => (
    <div className={styles.footer}>
      <p className={styles.fileName}>
        {fileName.length > 20 ? fileName.slice(0, 20) + "..." : fileName}
      </p>
      {renderActions()}

      <a
        style={{
          textDecoration: "none",
          color: "#2d89ef",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
        href={getDownloadUrl(fileUrl)}
        download
        rel="noopener noreferrer">
        <Button type="default" size="small">
          <FaDownload /> Tải file
        </Button>
      </a>
    </div>
  );

  const renderCard = (content) => (
    <div className={styles.card}>
      {renderCheckbox()}
      {content}
      {renderFooter()}
    </div>
  );

  // Image
  if (
    extension.startsWith("image") ||
    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)
  ) {
    return (
      <>
        {renderCard(
          <img
            src={fileUrl}
            alt={fileName}
            className={styles.image}
            onClick={() => setIsImagePreviewOpen(true)}
          />
        )}

        {isImagePreviewOpen && (
          <div
            className={styles.modalOverlay}
            onClick={() => setIsImagePreviewOpen(false)}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.closeButton}
                onClick={() => setIsImagePreviewOpen(false)}>
                <FaTimes />
              </button>
              <img
                src={fileUrl}
                alt={fileName}
                className={styles.previewImage}
              />
              <div className={styles.modalFooter}>
                <p className={styles.fileName}>
                  {fileName.length > 20
                    ? fileName.slice(0, 20) + "..."
                    : fileName}
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Video
  if (
    extension.startsWith("video") ||
    ["mp4", "webm", "ogg"].includes(extension)
  ) {
    return renderCard(
      <video controls className={styles.video}>
        <source src={fileUrl} type={fileType} />
        Trình duyệt không hỗ trợ video.
      </video>
    );
  }

  // MKV (không stream trực tiếp)
  if (extension === "mkv" || fileType === "video/x-matroska") {
    return renderCard(<p>Định dạng MKV không hỗ trợ xem trực tiếp.</p>);
  }

  if (extension === "pdf" || fileType === "application/pdf") {
    return renderCard(
      <div className={styles.pdfPreview}>
        <iframe
          src={fileUrl}
          title={fileName}
          className={styles.pdfViewer}
          width="100%"
          height="245px"
          style={{ maxHeight: "245px" }}
          onError={() => alert("Không thể tải được tài liệu PDF.")}
        />
      </div>
    );
  }

  if (
    [
      "xls",
      "xlsx",
      "sheet",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ].includes(extension)
  ) {
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
      fileUrl
    )}&embedded=true`;
    return renderCard(
      <div className={styles.documentPreview}>
        <iframe
          src={viewerUrl}
          title={fileName}
          className={styles.documentViewer}
          width="100%"
          height="245px"
          style={{ maxHeight: "245px" }}
        />
        <p>{fileName.length > 20 ? fileName.slice(0, 20) + "..." : fileName}</p>
      </div>
    );
  }

  // Khác
  return renderCard(
    <p>
      Không thể xem trước định dạng này: <strong>{extension}</strong>
    </p>
  );
};

export default FileViewer;
