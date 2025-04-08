import React, { useState, useEffect } from "react";
import { Table, Space, Dropdown, Modal, Button, Popconfirm  } from "antd";
import type { TableColumnsType, MenuProps  } from "antd";
import { DownOutlined } from "@ant-design/icons";
import ApprovalTableInboundRequest from "./ApprovalTableInboundRequest";
import { useGetInboundRequestQuery } from "../../../hooks/api/inboundRequest/getInboundRequestQuery";
import { useUpdateInboundRequestMutation } from "../../../hooks/api/inboundRequest/updateInboundRequestMutation";
import { InboundRequestDetail } from "../../../types/inboundRequest";

interface DataType {
  key: number;
  ngaytao: string;
  tongtien: number;
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

// const confirm: PopconfirmProps['onConfirm'] = (e) => {
//   console.log(e);
//   message.success('Click on Yes');
// };

// const cancel: PopconfirmProps['onCancel'] = (e) => {
//   console.log(e);
//   message.error('Click on No');
// };

const ApprovalInboundRequestList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "detail">("detail");
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const { data, refetch  } = useGetInboundRequestQuery(initialData);
  const { mutate, isSuccess } = useUpdateInboundRequestMutation();


 const handleAccountantChangeStatus = (inboundId: number, status: string) => {
  mutate(
    {
      data: {
        inboundId: inboundId,
        inboundOrderStatus: status
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

  useEffect(() => {
    refetch();
  }, []);
  
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
    { title: "Ngày tạo", dataIndex: "ngaytao" },
    { title: "Tổng tiền", dataIndex: "tongtien" },
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

const transformedData: DataType[] = Array.isArray(data?.items)
  ? data.items
    .filter((item) => item.status.toString() === "WaitingForAccountantApproval")
    .map((item) => ({
      key: item.inboundRequestId,
      maphieu: item.inboundRequestCode,
      ngaytao: item.createDate,
      tongtien: item.price,
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
             <Popconfirm
              title="Thông báo"
              description="Bạn có chắc hủy phiếu đặt hàng này?"
                onConfirm={() => {
                if (selectedRecord?.key !== undefined) {
                  handleAccountantChangeStatus(selectedRecord.key, "Cancelled");
                   }
                  }}   
              okText="Yes"
                cancelText="Cancel"
                
              >
            <Button key="cancel" danger>
                Huỷ yêu cầu
                </Button>
                </Popconfirm>
              <Popconfirm
              title="Thông báo"
              description="Bạn có chắc phê duyệt phiếu đặt hàng này?"
                onConfirm={() => {
                if (selectedRecord?.key !== undefined) {
                  handleAccountantChangeStatus(selectedRecord.key, "WaitingForDirectorApproval");
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

export default ApprovalInboundRequestList;
