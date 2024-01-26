import { Button, Form, Input, Modal, Typography } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify'
import DysonApi from '../../axios/DysonApi.ts';


const AddCategoryModal = ({
    isVisible,
    setIsVisible,
    refetchCategory,
}: any) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        //check error when user submit
        const data = form.getFieldsValue()
        const { categoryName, categoryDescription } = data

        try {
            setIsLoading(true);
            await DysonApi.addCategory({
                name: categoryName,
                description: categoryDescription || undefined,
            })
            await refetchCategory()
            toast.success("Create category successfully");
            onResetForm()
            setIsVisible(false);
        } catch (error: any) {
            console.log(error.error);
            toast.error(error.error[0]);
        } finally {
            setIsLoading(false);
        }
    }

    const onResetForm = () => {
        form.resetFields();
    }

    return (
        <Modal
            open={isVisible}
            onCancel={() => setIsVisible(false)}
            footer={null}
        >
            <div>
                <Typography.Title level={4}>
                    Add Category
                </Typography.Title>

                <Form
                    style={{
                        boxShadow: '0px 4px 30px 0px rgba(27, 25, 86, 0.10)',
                        borderRadius: '12px',
                        marginTop: '24px',
                        padding: '20px 24px',
                        gap: '20px'
                    }}
                    name="addCategory"
                    onFinish={handleSubmit}
                    form={form}
                >
                    <Form.Item
                        name='categoryName'
                        rules={[{
                            required: true,
                            message: 'Please input your category name!',
                        }]}
                    >
                        <Input
                            placeholder="Category Name"
                            bordered={false}
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        name="categoryDescription"
                    >
                        <Input.TextArea
                            placeholder="Description"
                            className="border round-sm"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-50" disabled={isLoading}>
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onResetForm} className="w-50">
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal >
    )
}

export default AddCategoryModal 
