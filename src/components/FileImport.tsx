import React, { useState } from "react";
import { Upload, Button, Input, Modal, Table } from "antd";
import {
  UploadOutlined,
  FileFilled,
  FilePdfFilled,
  FileImageFilled,
  FileExcelFilled,
  FileWordFilled,
} from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
import styled from "styled-components";

interface FileImportProps {
  fileList: File[];
  setFileList: React.Dispatch<React.SetStateAction<File[]>>;
}

interface CustomFile extends File {
  customName?: string;
}

const getFileIcon = (fileType: string) => {
  if (fileType.includes("pdf")) return <FilePdfFilled />;
  if (fileType.includes("image")) return <FileImageFilled />;
  if (fileType.includes("excel") || fileType.includes("spreadsheet"))
    return <FileExcelFilled />;
  if (fileType.includes("word")) return <FileWordFilled />;
  return <FileFilled />;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

const FileImport: React.FC<FileImportProps> = ({ fileList, setFileList }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<RcFile | null>(null);
  const [newFileName, setNewFileName] = useState("");

  const handleUploadChange = (info: { fileList: UploadFile[] }) => {
    const newFiles = info.fileList.filter(
      (file) => !fileList.some((f) => f.name === file.name)
    );
    if (newFiles.length > 0) {
      const file = newFiles[0].originFileObj as RcFile;
      setPendingFile(file);
      setNewFileName(file.name);
      setIsModalOpen(true);
    }
  };

  const handleRenameOk = () => {
    if (pendingFile) {
      const renamedFile = new File([pendingFile], newFileName, {
        type: pendingFile.type,
        lastModified: pendingFile.lastModified,
      }) as CustomFile;
      renamedFile.customName = newFileName;
      setFileList([...fileList, renamedFile]);
    }
    setIsModalOpen(false);
    setNewFileName("");
    setPendingFile(null);
  };

  const handleRenameCancel = () => {
    setIsModalOpen(false);
    setNewFileName("");
    setPendingFile(null);
  };

  const uploadProps: UploadProps = {
    beforeUpload: () => false,
    onChange: handleUploadChange,
    fileList: [],
    multiple: true,
  };

  const columns = [
    {
      dataIndex: "type",
      key: "icon",
      render: (type: string) => getFileIcon(type),
      width: 60,
    },
    {
      title: "Tên tệp",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: CustomFile) => record.customName || record.name,
    },
    {
      title: "Loại tệp",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        if (type.includes("pdf")) return "pdf";
        if (type.includes("image")) return "image";
        if (type.includes("excel") || type.includes("spreadsheet"))
          return "excel";
        if (type.includes("word")) return "word";
        return type.split("/")[1] || type;
      },
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
      render: (size: number) => formatFileSize(size),
    },
  ];

  return (
    <Container>
      <Upload {...uploadProps}>
        <CloseButton icon={<UploadOutlined />}>Chọn tệp</CloseButton>
      </Upload>

      {fileList.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>Tệp đã chọn</div>
          <Table
            bordered
            columns={columns}
            dataSource={fileList}
            rowKey={(record) => record.name}
            pagination={false}
            size="small"
          />
        </div>
      )}

      <Modal
        title="Đặt tên tệp"
        open={isModalOpen}
        onOk={handleRenameOk}
        onCancel={handleRenameCancel}
        style={{ width: "fit-content" }}
        footer={[
          <CloseButton key="close" onClick={handleRenameCancel}>
            Hủy
          </CloseButton>,
          <CtaButton
            key="save"
            onClick={handleRenameOk}
            disabled={!newFileName.trim()}
          >
            Xác nhận
          </CtaButton>,
        ]}
      >
        <Input
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="Nhập tên tệp"
        />
      </Modal>
    </Container>
  );
};

export default FileImport;

const Container = styled.div`
  margin-top: var(--line-width-thin);
`;

const CloseButton = styled(Button)`
  &:hover {
    border-color: var(--color-secondary-600) !important;
    color: var(--color-secondary-600) !important;
  }
`;

const CtaButton = styled(Button)`
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;
