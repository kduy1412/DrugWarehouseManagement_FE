import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef, TableProps } from "antd";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  Select,
  Modal,
  notification,
  Typography,
} from "antd";
import { useGetProductQuery } from "../../../hooks/api/product/getProductQuery";
import { useCreateInboundRequestMutation } from "../../../hooks/api/inboundRequest/createInboundRequestMutation";
import FileImport from "../../../components/FileImport";
import { parseToVietNameseCurrency } from "../../../utils/parseToVietNameseCurrency";
import styled from "styled-components";
import { InboundRequestPostRequest } from "../../../types/inboundRequest";
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<Item> | null>(null);

interface Item {
  key: string;
  name: string;
  productId: number;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<Omit<EditableRowProps, "index">> = (props) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  productOptions?: { label: string; value: number }[];
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  productOptions,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        {dataIndex === "name" ? (
          <div>
            <Select
              showSearch
              placeholder="Chọn sản phẩm"
              options={productOptions}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onBlur={save}
              onChange={(value, option) => {
                const selectedOption = option as {
                  label: string;
                  value: number;
                };
                if (!selectedOption) return;

                form.setFieldsValue({
                  name: selectedOption.label,
                  productId: selectedOption.value,
                });

                save();
              }}
            />
            <Form.Item name="productId" hidden>
              <Input />
            </Form.Item>
          </div>
        ) : (
          <Input onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
  productId: number;
  name: string;
  quantity: string;
  unitprice: string;
  totalprice: string;
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

const initialData = {
  Page: 1,
  PageSize: 100,
};

const CreateInboundRequest: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const { data, isLoading } = useGetProductQuery(initialData);
  const [productOptions, setProductOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const { mutate, isSuccess, isPending } = useCreateInboundRequestMutation();
  const [modalConfirmInboundRequest, setModalConfirmInboundRequest] =
    useState(false);
  const [noteConfirm, setNoteConfirm] = useState("");
  const [file, setFile] = useState<File[]>([]);

  const [count, setCount] = useState(2);

  useEffect(() => {
    if (data?.items) {
      setProductOptions(
        data.items.map((product) => ({
          label: `${product.productName} | ${product.sku}`,
          value: product.productId,
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      setModalConfirmInboundRequest(false);
      setDataSource([]);
    }
  }, [isSuccess]);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      width: "30%",
      editable: true,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      editable: true,
    },
    {
      title: "Giá thành",
      dataIndex: "unitprice",
      editable: true,
      render: (value: string) => parseToVietNameseCurrency(Number(value)),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalprice",
      render: (value: string) => parseToVietNameseCurrency(Number(value)),
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      productId: 0,
      name: `Chọn sản phẩm`,
      quantity: "1",
      unitprice: `0`,
      totalprice: ``,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    const updatedProductId = row.productId || item.productId;

    const totalPrice =
      (parseFloat(row.quantity) || 0) * (parseFloat(row.unitprice) || 0);

    newData.splice(index, 1, {
      ...item,
      ...row,
      productId: updatedProductId,
      totalprice: totalPrice.toFixed(2),
    });
    setDataSource(newData);
  };

  const handleSubmit = () => {
    const submitData = {
      note: noteConfirm || "",
      inboundRequestDetails: dataSource.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitprice),
        totalPrice: Number(item.totalprice),
      })),
      Images: file,
    } as InboundRequestPostRequest;

    const validation = validateSubmitData(submitData);
    if (!validation.isValid) {
      notification.error({
        message: "Lỗi Xác Thực",
        description: validation.message,
        placement: "topRight",
      });
      return;
    }
    mutate(submitData);
  };

  const validateSubmitData = (src: InboundRequestPostRequest) => {
    if (
      !Array.isArray(src.inboundRequestDetails) ||
      src.inboundRequestDetails.length === 0
    ) {
      return {
        isValid: false,
        message: "Cần ít nhất một sản phẩm.",
      };
    }

    for (const item of src.inboundRequestDetails) {
      if (!item.productId || item.productId.toString().trim() === "") {
        return {
          isValid: false,
          message: "Mã sản phẩm là bắt buộc cho tất cả các mục.",
        };
      }

      const quantity = Number(item.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        return {
          isValid: false,
          message: "Số lượng phải là số dương cho tất cả các mục.",
        };
      }

      const unitPrice = Number(item.unitPrice);
      if (isNaN(unitPrice) || unitPrice <= 0) {
        return {
          isValid: false,
          message: "Đơn giá phải là số dương cho tất cả các mục.",
        };
      }

      const totalPrice = Number(item.totalPrice);
      if (isNaN(totalPrice) || totalPrice <= 0) {
        return {
          isValid: false,
          message: "Tổng giá phải là số dương cho tất cả các mục.",
        };
      }
    }

    return { isValid: true };
  };

  const handleCancelSubmit = () => {
    setModalConfirmInboundRequest(false);
    setFile([]);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: (props: EditableCellProps) => (
        <EditableCell
          {...props}
          productOptions={productOptions.filter((item) =>
            dataSource.every((data) => data.productId !== item.value)
          )}
        />
      ),
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <CtaButton
        onClick={handleAdd}
        loading={isPending}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Thêm sản phẩm mới
      </CtaButton>
      <CloseButton
        style={{ marginLeft: 16 }}
        loading={isPending}
        onClick={() => {
          if (dataSource.length === 0) {
            notification.error({
              message: "Vui lòng thêm sản phẩm, danh sách không được để trống!",
            });
          } else {
            setModalConfirmInboundRequest(true);
          }
        }}
      >
        Tạo phiếu đặt hàng
      </CloseButton>
      <Table<DataType>
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        loading={isLoading}
      />
      <StyledModal
        title="Thông báo"
        centered
        open={modalConfirmInboundRequest}
        onOk={handleSubmit}
        onCancel={handleCancelSubmit}
        footer={[
          <CloseButton key="close" onClick={handleCancelSubmit}>
            Hủy
          </CloseButton>,
          <CtaButton key="save" onClick={handleSubmit} disabled={isPending}>
            Xác nhận
          </CtaButton>,
        ]}
        wrapClassName="wrap-confirm"
      >
        <p>Xác nhận tạo phiếu đặt hàng?</p>
        <Input.TextArea
          rows={3}
          placeholder="Ghi chú (nếu có)"
          value={noteConfirm}
          onChange={(e) => setNoteConfirm(e.target.value)}
        />
        <FileImport fileList={file} setFileList={setFile} />
      </StyledModal>
    </div>
  );
};

export default CreateInboundRequest;

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

const StyledModal = styled(Modal)``;
