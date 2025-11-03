import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import API from "../services/api";

const TaskForm = ({ initialValues = null, onSaved = () => { }, onCancel = () => { } }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                title: initialValues.title,
                description: initialValues.description,
                ownerEmail: initialValues.ownerEmail,
                status: initialValues.status,
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (initialValues && initialValues._id) {
                await API.put(`/api/tasks/${initialValues._id}`, values);
                message.success("Task updated!");
            } else {
                await API.post("/api/tasks", values);
                message.success("Task created!");
            }
            form.resetFields();
            onSaved();
        } catch (err) {
            console.error(err);
            message.error("Error saving task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ width: "100%" }}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title required" }]}>
                <Input placeholder="Task title" />
            </Form.Item>

            <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} placeholder="Description" />
            </Form.Item>

            <Form.Item name="ownerEmail" label="Owner email" rules={[{ required: true, message: "Email required" }]}>
                <Input placeholder="Owner email" />
            </Form.Item>

            <Form.Item style={{ textAlign: "right" }}>
                <Button
                    style={{ marginRight: 8 }}
                    onClick={() => { form.resetFields(); onCancel(); }}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                >
                    {loading
                        ? (initialValues && initialValues._id ? "Updating..." : "Adding...")
                        : (initialValues && initialValues._id ? "Update Task" : "Add Task")
                    }
                </Button>
            </Form.Item>
        </Form>
    );
};

export default TaskForm;
