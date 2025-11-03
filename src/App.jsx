import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Layout, Typography, message, Button, Modal } from "antd";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilter from "./components/TaskFilter";
import API from "./services/api";
import { IoAddCircleOutline } from "react-icons/io5";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/api/tasks");
      console.log(res.data);
      setTasks(res.data);
      setFilteredTasks(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();

    const socket = io("http://localhost:5000", {
      transports: ["websocket"], 
    });

    socket.on("taskCreated", (task) => setTasks((prev) => [task, ...prev]));
    socket.on("taskUpdated", (updated) =>
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      )
    );
    socket.on("taskDeleted", ({ id }) =>
      setTasks((prev) => prev.filter((t) => t._id !== id))
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (filter === "All") setFilteredTasks(tasks);
    else setFilteredTasks(tasks.filter((t) => t.status === filter));
  }, [filter, tasks]);

  return (
    <Layout style={{ minHeight: "100vh", padding: 20 }}>
      <Header style={{ background: "#fff", height:"fit-content" , padding:20, marginInline:20, borderRadius:10}}>
        <Title level={2} style={{margin:0, fontSize:25, textAlign:"left"}}>Task Management</Title>
      </Header>
      <Content style={{ padding: 20 }}>
        <div className="task-controls">
          <TaskFilter filter={filter} setFilter={setFilter} />
          <Button type="primary" onClick={() => { setEditingTask(null); setIsModalVisible(true); }}>
            <IoAddCircleOutline />
            Add Task
          </Button>
        </div>

        <TaskList
          tasks={filteredTasks}
          refresh={fetchTasks}
          onEdit={(task) => { setEditingTask(task); setIsModalVisible(true); }}
        />

        <Modal
          title={editingTask ? "Edit Task" : "Add Task"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <TaskForm
            initialValues={editingTask}
            onSaved={() => { setIsModalVisible(false); fetchTasks(); }}
            onCancel={() => setIsModalVisible(false)}
          />
        </Modal>
      </Content>
    </Layout>
  );
}

export default App;
