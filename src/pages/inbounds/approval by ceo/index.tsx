import React, { useEffect, useState } from "react";
import { Table, Space, Dropdown, Modal, Button, Popconfirm } from "antd";
import type { TableColumnsType, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import ApprovalTableInboundRequest from "./ApprovalTableInboundRequest";
import { InboundRequestDetail } from "../../../types/inboundRequest";
import { useGetInboundRequestQuery } from "../../../hooks/api/inboundRequest/getInboundRequestQuery";
import { useUpdateInboundRequestMutation } from "../../../hooks/api/inboundRequest/updateInboundRequestMutation";

interface DataType {
  key: number;
  maphieu: string;
  ghichu: string;
  trangthai: string;
  sanpham: InboundRequestDetail[];
}

  const initialData = {
  Page: 1,
  PageSize: 100
  ,
};

const ApprovalInboundRequestListByCEO: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "detail">("detail");
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);

    const { data, refetch  } = useGetInboundRequestQuery(initialData);
    const { mutate, isSuccess } = useUpdateInboundRequestMutation();
  
  
   const handleAccountantApproval = (inboundId: number) => {
    console.log("trước if: ", isSuccess);
  
    mutate(
      {
        data: {
          inboundId: inboundId,
          inboundOrderStatus: 'Completed'
        },
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          refetch();
        }
      }
    );
  };
  
    useEffect(() => {
        console.log("Dữ liệu API Inbound Approval trả về:", data?.items);
    }, [data]);
    
  const handleOpenModal = (record: DataType, type: "edit" | "detail") => {
    setSelectedRecord(record);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const items = (record: DataType): MenuProps["items"] => [
    {
      key: "1",
      label: <a onClick={() => handleOpenModal(record, "edit")}>Chỉnh sửa</a>,
    },
    {
      key: "2",
      label: <a onClick={() => handleOpenModal(record, "detail")}>Chi tiết</a>,
    },
  ];

  const columns: TableColumnsType<DataType> = [
    { title: "Mã phiếu", dataIndex: "maphieu" },
    { title: "Ghi chú", dataIndex: "ghichu" },
    { title: "Trạng thái", dataIndex: "trangthai" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Dropdown menu={{ items: items(record) }}>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <Space>
              Thao tác <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      ),
    },
  ];

  // const data: DataType[] = [
  //   {
  //     key: "1",
  //     maphieu: "PH001",
  //     ngaytao: "2024-03-01",
  //     nguoitao: "Nguyễn Văn A",
  //     tongtien: "10,000,000 VND",
  //     trangthai: "Đã nhập kho",
  //   },
  //   {
  //     key: "2",
  //     maphieu: "PH002",
  //     ngaytao: "2024-03-02",
  //     nguoitao: "Trần Thị B",
  //     tongtien: "5,000,000 VND",
  //     trangthai: "Chờ duyệt",
  //   },
  //   {
  //     key: "3",
  //     maphieu: "PH003",
  //     ngaytao: "2024-03-03",
  //     nguoitao: "Lê Văn C",
  //     tongtien: "15,000,000 VND",
  //     trangthai: "Đang xử lý",
  //   },
  // ];

const transformedData: DataType[] = Array.isArray(data?.items)
  ? data.items.map((item) => ({
      key: item.inboundRequestId,
      maphieu: item.inboundRequestCode,
      ghichu: item.note || "Không có ghi chú",
      trangthai: item.status.toString(),
      sanpham: item.inboundRequestDetails || []
    }))
  : [];


   return (
    <>
      <Table<DataType>
        columns={columns}
        dataSource={transformedData}
        size="middle"
        pagination={{ pageSize: 50 }}
        //scroll={{ y: 55 * 5 }}
      />

      {/* Modal for Edit or Detail */}
      <Modal
        title={modalType === "edit" ? "Chỉnh sửa phiếu nhập" : "Chi tiết phiếu nhập"}
        open={isModalOpen}
        footer={[
          modalType === "detail" ? (
            <>
            <Button key="cancel" danger>
                Huỷ yêu cầu
              </Button>
            <Button key="allowEdit">
                Yêu cầu chỉnh sửa
              </Button>
              <Popconfirm
              title="Thông báo"
              description="Bạn có chắc phê duyệt phiếu đặt hàng này?"
                onConfirm={() => {
                if (selectedRecord?.key !== undefined) {
                handleAccountantApproval(selectedRecord.key);
                   }
                  }}   
              okText="Yes"
                cancelText="Cancel"
                
              >
              <Button key="confirm" type="primary"
                // onClick={() => {
                // if (selectedRecord?.key !== undefined) {
                // handleAccountantApproval(selectedRecord.key);
                //    }
                //   }}
                >
                Duyệt
                </Button>
                </Popconfirm>
            </>
          ) : null,
          <Button key="cancel" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        {selectedRecord && (
          <div>
            <p>
              <strong>Mã phiếu:</strong> {selectedRecord.maphieu}
            </p>
            <p>
              <strong>Mã phiếu:</strong> {selectedRecord.ghichu}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedRecord.trangthai}
            </p>
    {selectedRecord.sanpham && (
      <ApprovalTableInboundRequest listInboundRequest={selectedRecord.sanpham} />
    )}          </div>
        )}

      </Modal>
    </>
  );
};

export default ApprovalInboundRequestListByCEO;
