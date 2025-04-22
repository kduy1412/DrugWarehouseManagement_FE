import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Pagination,
  Spin,
  Table,
  TableProps,
  Tag,
  Typography,
} from "antd";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { LotGetRequestParams, LotGetView } from "../../../types/lot";
import { useGetLotQuery } from "../../../hooks/api/lot/getLotQuery";
import ActionDropdown from "./components/ActionDropdown";
import DetailsModal from "./components/DetailsModal";
import FilterComponent from "./components/FilterComponent";
import { SystemWarehouseConfigEnum } from "../../../types/enums/system";
import WarehouseSelector from "../../../components/warehouse/WarehouseSelector";
import { WarehouseGetRequestParams } from "../../../types/warehouse";
import { useGetWarehouseQuery } from "../../../hooks/api/warehouse/getWarehouseQuery";
import ConfirmModal from "../../../components/ConfirmModal";
import { useCreateLotTransferMutation } from "../../../hooks/api/lotTransfer/createLotTransferMutation";
import { LotTransferPostRequest } from "../../../types/outbound";

type DataType = LotGetView;

const initialData: LotGetRequestParams = {
  Page: 1,
  PageSize: 10,
  WarehouseId: SystemWarehouseConfigEnum.ReturnedWarehouse,
  Availablle: true,
};

const ReturnedLotsPage = () => {
  // Component states
  const [initParams, setInitParams] =
    useState<LotGetRequestParams>(initialData);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReturnedModalOpen, setIsReturnedModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LotGetView | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(
    null
  );
  const [searchWarehouseFilter, setSearchWarehouseFilter] =
    useState<WarehouseGetRequestParams>({
      Page: 1,
      PageSize: 100,
    });

  const [confirmModalOpen, setConfirmModalOpen] = useState({
    cancel: false,
    accept: false,
  });
  const [form] = Form.useForm<{ quantity: number }>();

  // Data fetching
  const { data, isLoading } = useGetLotQuery(initParams);
  const { data: queryWarehouse, isLoading: warehouseQueryLoading } =
    useGetWarehouseQuery(searchWarehouseFilter);
  const { mutate: createLot, isPending: createLotPending } =
    useCreateLotTransferMutation();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "#",
      dataIndex: "lotId",
      key: "lotId",
      render: (id) => <strong>{id}</strong>,
    },
    {
      title: "Mã Lô Trả",
      dataIndex: "lotNumber",
      key: "lotNumber",
      render: (lotNumber) => <p>{lotNumber}</p>,
    },
    {
      title: "Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (productName) =>
        productName || <Tag color="warning">Chưa xác định</Tag>,
    },
    {
      title: "Nhà Cung Cấp",
      dataIndex: "providerName",
      key: "providerName",
      render: (providerName) =>
        providerName || <Tag color="warning">Chưa xác định</Tag>,
    },
    {
      title: "Số Lượng Trả",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <p>{quantity}</p>,
    },
    {
      key: "action",
      render: (_, item) => (
        <ActionDropdown
          onDetail={() => {
            setIsDetailModalOpen(true);
            setSelectedItem(item);
          }}
          onReturned={() => {
            setIsReturnedModalOpen(true);
            setSelectedItem(item);
          }}
        />
      ),
    },
  ];

  const handleOnChange = (page: number) => {
    setInitParams((prev) => ({
      ...prev,
      Page: page,
    }));
  };

  const handleOnShowSizeChange = (_: number, pageSize: number) => {
    setInitParams((prev) => ({
      ...prev,
      PageSize: pageSize,
    }));
  };

  const onSearchWarehouseChange = useCallback((value: string) => {
    setSearchWarehouseFilter((prev) => ({ ...prev, Search: value }));
  }, []);

  const onSelectedWarehouse = (record: number | null) => {
    if (record !== null) setSelectedWarehouse(record);
  };

  const onFormClose = () => {
    setIsReturnedModalOpen(false);
    setConfirmModalOpen({
      accept: false,
      cancel: false,
    });
    setIsDetailModalOpen(false);
    setSelectedWarehouse(null);
    setSelectedItem(null);
    form.resetFields();
  };

  const handleCancelReturnedLot = () => {
    if (!selectedItem) {
      notification.error({
        message: "Chưa chọn lô",
      });
      return;
    }

    const data: LotTransferPostRequest = {
      fromWareHouseId: SystemWarehouseConfigEnum.ReturnedWarehouse,
      toWareHouseId: SystemWarehouseConfigEnum.CancelWarehouse,
      lotTransferDetails: [
        {
          lotId: selectedItem.lotId,
          quantity: selectedItem.quantity,
        },
      ],
    };
    createLot(data, {
      onSuccess: () => onFormClose(),
    });
  };

  const handleApproveReturnedLot = async () => {
    if (!selectedItem) {
      notification.error({
        message: "Chưa chọn lô",
      });
      return;
    }

    if (!selectedWarehouse) {
      notification.error({
        message: "Chưa chọn kho muốn hoàn trả",
      });
      return;
    }

    const quantity = form.getFieldValue("quantity");
    if (!quantity || quantity <= 0) {
      notification.error({
        message: "Số lượng không hợp lệ",
      });
      return;
    }

    const returnedData: LotTransferPostRequest = {
      fromWareHouseId: SystemWarehouseConfigEnum.ReturnedWarehouse,
      toWareHouseId: selectedWarehouse,
      lotTransferDetails: [
        {
          lotId: selectedItem.lotId,
          quantity,
        },
      ],
    };
    createLot(returnedData);
    onFormClose();
  };

  const filteredWarehouse = queryWarehouse?.items.filter(
    (item) =>
      item.warehouseId !== SystemWarehouseConfigEnum.CancelWarehouse &&
      item.warehouseId !== SystemWarehouseConfigEnum.ReturnedWarehouse
  );
  return (
    <>
      <FilterComponent
        initialQueryParams={initialData}
        setQuery={setInitParams}
        query={initParams}
      />
      {data && (
        <>
          <Table<DataType>
            bordered
            pagination={false}
            dataSource={data.items}
            columns={columns}
            rowKey="lotId"
          />
          <StyledPagination
            showSizeChanger
            align="end"
            defaultCurrent={1}
            total={data.totalCount}
            pageSize={data.pageSize}
            current={initParams.Page}
            onChange={handleOnChange}
            onShowSizeChange={handleOnShowSizeChange}
          />
        </>
      )}
      {isLoading && (
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Spin />
        </Flex>
      )}
      {selectedItem && isDetailModalOpen && (
        <DetailsModal
          isModalOpen={isDetailModalOpen}
          item={selectedItem}
          setIsModalOpen={setIsDetailModalOpen}
        />
      )}
      {selectedItem && isReturnedModalOpen && (
        <Modal
          title="Số lượng nhập kho & Vị trí"
          open={isReturnedModalOpen}
          onClose={onFormClose}
          footer={[
            <CloseButton key="close" onClick={onFormClose}>
              Đóng
            </CloseButton>,
            <Button
              danger
              key="cancel"
              onClick={() =>
                setConfirmModalOpen((prev) => ({ ...prev, cancel: true }))
              }
            >
              Hủy toàn bộ
            </Button>,
            <CtaButton
              key="accept"
              onClick={() =>
                setConfirmModalOpen((prev) => ({ ...prev, accept: true }))
              }
            >
              Nhập kho
            </CtaButton>,
          ]}
        >
          <Form
            form={form}
            initialValues={{
              quantity: selectedItem.quantity,
            }}
          >
            <Form.Item label="Kho nhận hàng">
              <WarehouseSelector
                value={selectedWarehouse}
                onSearchValueChange={onSearchWarehouseChange}
                onSelectedWarehouseChange={onSelectedWarehouse}
                warehouses={filteredWarehouse}
                loading={warehouseQueryLoading}
                placeholder="Kho muốn chuyển vào"
              />
            </Form.Item>
            <Form.Item name="quantity" label="Số lượng muốn nhập lại kho">
              <InputNumber max={selectedItem.quantity} min={1} />
            </Form.Item>
          </Form>
        </Modal>
      )}
      {selectedItem && confirmModalOpen.accept && (
        <ConfirmModal
          visible={confirmModalOpen.accept}
          content={
            <div>
              <p>Bạn có chắc chắn muốn nhập lô trả về này?</p>
              <Typography.Text>
                <strong>Lưu ý: </strong>sau khi xác nhận, số lượng hàng tồn còn
                lại sẽ bị đưa vào{" "}
                <Typography.Text mark>kho hủy</Typography.Text>
              </Typography.Text>
            </div>
          }
          onCancel={() =>
            setConfirmModalOpen((prev) => ({ ...prev, accept: false }))
          }
          onConfirm={handleApproveReturnedLot}
          title="Nhập lô"
          cancelText="Từ Chối"
          confirmText="Chấp Nhận"
          loading={createLotPending}
        />
      )}
      {selectedItem && confirmModalOpen.cancel && (
        <ConfirmModal
          visible={confirmModalOpen.cancel}
          content={
            <div>
              <p>Bạn có chắc chắn muốn hủy lô trả về này?</p>
              <Typography.Text>
                <strong>Lưu ý: </strong>sau khi xác nhận, tất cả hàng trả về sẽ
                bị đưa vào <Typography.Text mark>kho hủy</Typography.Text>
              </Typography.Text>
            </div>
          }
          onCancel={() =>
            setConfirmModalOpen((prev) => ({ ...prev, cancel: false }))
          }
          onConfirm={handleCancelReturnedLot}
          title="Hủy lô"
          cancelText="Từ Chối"
          confirmText="Chấp Nhận"
          loading={createLotPending}
        />
      )}
    </>
  );
};

export default ReturnedLotsPage;

const StyledPagination = styled(Pagination)`
  margin-top: var(--line-width-light);
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
