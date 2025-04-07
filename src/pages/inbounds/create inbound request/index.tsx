import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Form, Input, Popconfirm, Table, Select, Modal } from 'antd';
// import { ProductGetRequestParams } from '../../../types/product';
import { useGetProductQuery } from "../../../hooks/api/product/getProductQuery";
import { useCreateInboundRequestMutation } from "../../../hooks/api/inboundRequest/createInboundRequestMutation";
// import { validateObjectProperties } from "../../../utils/validateObjectProperties";
// import {
//   InboundRequestDetail,
//   InboundRequestDetailRequest,
//   InboundRequestPostRequest,
// } from "../../../types/inboundRequest";
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

const EditableRow: React.FC<Omit<EditableRowProps, 'index'>> = (props) => {

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
      console.log('Save failed:', errInfo);
    }
  };
  

  let childNode = children;

  if (editable) {
    childNode = editing ? (
<Form.Item
  style={{ margin: 0 }}
  name={dataIndex}
  rules={[{ required: true, message: `${title} is required.` }]}>
  {dataIndex === 'name' ? (
    <div>
      <Select
        showSearch
        placeholder="Chọn sản phẩm"
        options={productOptions}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        onBlur={save}
        onChange={(value, option) => {
          const selectedOption = option as { label: string; value: number };
          if (!selectedOption) return;

          form.setFieldsValue({ 
            name: selectedOption.label, 
            productId: selectedOption.value  // ✅ Cập nhật productId
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

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

  const initialData = {
  Page: 1,
  PageSize: 100,
};

const CreateInboundRequest: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([
    
  ]);
  // const [initParams, setInitParams] =
  //   useState<ProductGetRequestParams>(initialData);
  const { data, isLoading } = useGetProductQuery(initialData);
  const [productOptions, setProductOptions] = useState<{ label: string; value: number }[]>([]);
  const { mutate, isSuccess } = useCreateInboundRequestMutation();
  const [modalConfirmInboundRequest, setModalConfirmInboundRequest] = useState(false);
  const [noteConfirm, setNoteConfirm] = useState('');

  const [count, setCount] = useState(2);
  useEffect(() => {
    console.log("Dữ liệu API trả về:", data);

    if (data?.items) {
      setProductOptions(
        data.items.map((product) => ({
          label: product.productName,
          value: product.productId,
        }))
      );
    }
  }, [data]);

    useEffect(() => {
    console.log("dataSource: ", dataSource);
    }, [dataSource]);
  
      useEffect(() => {
    console.log("tạo phiếu: ", isSuccess);
      }, [isSuccess]);
  
  useEffect(() => {
  if (isSuccess) {
    setModalConfirmInboundRequest(false);
  }
}, [isSuccess]);
  
  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };


  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      editable: true,
    },
    {
      title: 'Giá thành',
      dataIndex: 'unitprice',
      editable: true,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalprice',
    },
    {
      title: 'Thao tác',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
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
      quantity: '1',
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

    const totalPrice = (parseFloat(row.quantity) || 0) * (parseFloat(row.unitprice) || 0);

    newData.splice(index, 1, {
      ...item,
      ...row,
      productId: updatedProductId,  // ✅ Giữ productId nếu có
      totalprice: totalPrice.toFixed(2),
    });
    setDataSource(newData);

  };

    const handleSubmit = () => {
      // const isValidationSuccess = validateObjectProperties<InboundRequestPostRequest>(
      //   dataSource,
      //   validationMessage
      // );
      // if (isValidationSuccess) {
      //   mutate(dataSource);
      // }
mutate({
  note: noteConfirm || '',
  price: 1,
  inboundRequestDetails: dataSource.map((item) => ({
    productId: item.productId,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitprice),
    totalPrice: Number(item.totalprice),
  })),
});
    };
const components = {
  body: {
    row: EditableRow,
    cell: (props: EditableCellProps) => (
      <EditableCell {...props} productOptions={productOptions} />
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
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Thêm sản phẩm mới
      </Button>
      <Button style={{ marginLeft: 16 }} onClick={()=> setModalConfirmInboundRequest(true)}>
        Tạo phiếu đặt hàng
      </Button>
      <Table<DataType>
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        loading={isLoading}
      />
      <Modal
        title="Thông báo"
        centered
        open={modalConfirmInboundRequest}
        onOk={() => { handleSubmit(); }}
        onCancel={() => setModalConfirmInboundRequest(false)}
      >
        <p>Xác nhận tạo phiếu đặt hàng?</p>
        <Input.TextArea rows={3} placeholder="Ghi chú (nếu có)" 
        value={noteConfirm}
        onChange={(e) => setNoteConfirm(e.target.value)}/>
      </Modal>
    </div>
  );
};

export default CreateInboundRequest;