import { Select } from "antd";

const TaskFilter = ({ filter, setFilter }) => {
  const options = [
    { label: "All", value: "All" },
    { label: "To Do", value: "to-do" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
  ];

  return (
      <Select
        value={filter}
        onChange={(value) => setFilter(value)}
        options={options}
        style={{ width: 200 }}
        aria-label="Task status filter"
      />
  );
};

export default TaskFilter;
