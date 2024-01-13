import { Button, Form, Input, Popconfirm, Table, Typography } from "antd";
import { useQuery } from "react-query";
import DysonApi from "../../axios/DysonApi";
import { useState } from "react";
import { toast } from "react-toastify";
import AddCategoryModal from "./AddCategoryModal";

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}: any) => {
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default function CategoryTable() {

    const [form] = Form.useForm();
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const {
        data: listCategory = [],
        isLoading,
        refetch,
    } = useQuery('getListCategory', () => DysonApi.getAllCategory(), {
        refetchOnWindowFocus: 'always',
    }
    );

    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: any) => record.key === editingKey;
    const edit = (record: any) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key: string) => {
        try {
            const row = await form.validateFields();
            const categoryUpdate = await DysonApi.updateCategoryById(key, {
                name: row.name,
                description: row.description
            })
            if (categoryUpdate) {
                toast.success('Update category successfully')
                await refetch()
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            const resp = await DysonApi.deleteCategoryById(id)
            if (resp) {
                toast.success('Delete category successfully')
                await refetch()
            }
        } catch (error) {
            toast.error('Delete category failed')
        }
    }
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            editable: true,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <div className="d-flex ">
                        <Button disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Button>
                        <Popconfirm title="Sure to delete" onConfirm={() => handleDeleteCategory(record.key).then()}>
                            <Button danger className="ml-3">
                                Delete
                            </Button>
                        </Popconfirm>
                    </div>
                );
            },
        }
    ]

    const listCategoryTable = listCategory.map((category: any) => {
        return {
            key: category._id,
            name: category.name,
            description: category.description,
        }
    })

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <Button type='primary' className="my-3" onClick={() => setIsAdd(true)}>New Category</Button>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    columns={mergedColumns}
                    dataSource={listCategoryTable}
                    pagination={false}
                    bordered
                    loading={isLoading}
                    scroll={{ x: '50vw' }}
                />
            </Form>
            <AddCategoryModal
                isVisible={isAdd}
                setIsVisible={setIsAdd}
                refetchCategory={refetch}
            />
        </>
    )
}