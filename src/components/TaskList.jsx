import { Card, Button, Space, message } from "antd";
import API from "../services/api";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Line, RiLoader2Line } from "react-icons/ri";
import { TbArrowsExchange } from "react-icons/tb";
import { useState } from "react";

const capitalize = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const TaskList = ({ tasks, refresh, onEdit = () => { } }) => {
    const [loadingId, setLoadingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const handleStatusChange = async (task, newStatus) => {
        setLoadingId(task._id);
        try {
            await API.put(`/api/tasks/${task._id}`, { status: newStatus });
            message.success(`Status changed to ${newStatus}`);
            refresh();
        } catch (err) {
            console.error(err);
            message.error("Failed to update");
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await API.delete(`/api/tasks/${id}`);
            message.success("Task deleted");
            refresh();
        } catch (err) {
            console.error(err);
            message.error("Failed to delete");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            {tasks ? tasks?.map((task) => {
                const headerExtra = (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>

                        {task.status !== "completed" && (
                            <Button
                                size="small"
                                style={{ color: "#3b9310", border: "none", background: "#ddf6d0" }}
                                onClick={() => handleStatusChange(task, task.status === "to-do" ? "in-progress" : "completed")}
                                loading={loadingId === task._id}
                                icon={loadingId !== task._id && <TbArrowsExchange />}
                            >
                                Change Status
                            </Button>
                        )}

                        <Button size="small" style={{ border: "none", color: "blue", background: "#ebebff" }} onClick={() => onEdit(task)}>
                            <FiEdit /> Edit
                        </Button>

                        <Button
                            size="small"
                            danger
                            style={{ border: "none", color: '#ff4d4f', background: "#ffe2e2" }}
                            onClick={() => handleDelete(task._id)}
                            loading={deletingId === task._id}
                            icon={deletingId !== task._id && <RiDeleteBin5Line />}
                        >
                            {deletingId === task._id ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                );

                return (
                    <Card
                        key={task._id}
                        hoverable
                        style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                        bodyStyle={{ padding: 15 }}
                    >
                        <div className="task-card-content">
                            <div>
                                <span style={{
                                    fontWeight: 700,
                                    minWidth: 90,
                                    textAlign: "center",
                                    padding: "4px 12px",
                                    borderRadius: 12,
                                    background: task.status === "completed" ? "#04AA6D" : task.status === "in-progress" ? "#1890ff" : "grey",
                                    color: "#fff",
                                    fontSize: 12,
                                }}>{task.status == "to-do" && 'To Do' || task.status == "completed" && "Completed" || task.status == "in-progress" && "In Progress"}</span>
                                <p style={{ fontWeight: 600, marginBottom: 2 }}>{capitalize(task.title)}</p>
                                <p style={{ marginBottom: 2, marginTop: 0 }}>{task.description}</p>
                                <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Owner : {task.ownerEmail}</p>
                            </div>
                            {headerExtra}
                        </div>
                    </Card>
                );
            }) : "No tasks available."}
        </Space>
    );
};

export default TaskList;
