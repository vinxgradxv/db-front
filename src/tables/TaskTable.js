import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './Table.css';
import plusLogo from "../icons/icons8-plus-64.png";

const token = localStorage.getItem("authToken");

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <button onClick={onClose}>Close</button>
                {children}
            </div>
        </div>
    );
};

const TaskCard = ({ task, onStatusChange }) => {
    const [{ isDragging }, drag] = useDrag({
        type: "TASK",
        item: task,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            className="task-card"
            style={{
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            <p>Start Date: {task.startDate}</p>
            <p>End Date: {task.endDate}</p>
            <p>Complexity: {task.complexity}</p>
            <p>Status: {task.status}</p>
            <p>Productivity ID: {task.productivityStatisticsId}</p>
        </div>
    );
};

const Column = ({ status, tasks, onDrop }) => {
    const [, drop] = useDrop({
        accept: "TASK",
        drop: (item) => onDrop(item, status),
    });

    return (
        <div ref={drop} className="task-column">
            <h3 className="task-header">{status}</h3>
            {/*<TaskCard key={1} task={{startDate: '123', endDate: '123', complexity: '1', status, productivityStatisticsId: 2}}/>*/}
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    );
};

const Form = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [complexity, setComplexity] = useState("");
    const [status, setStatus] = useState("To Do");
    const [productivityStatisticsId, setProductivityStatisticsId] = useState("");

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const data = {
            startDate,
            endDate,
            complexity,
            status,
            productivityStatisticsId,
        };

        fetch("http://localhost:8080/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },        
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then(() => {
                alert("Task added successfully");
                window.location.reload(); // To refresh the task list
            })
            .catch((error) => {
                alert("Error: " + error);
            });
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div>
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <div>
                <label>Complexity:</label>
                <input
                    type="number"
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                />
            </div>
            <div>
                <label>Productivity ID:</label>
                <input
                    type="number"
                    value={productivityStatisticsId}
                    onChange={(e) => setProductivityStatisticsId(e.target.value)}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default function TaskBoard() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = () => {
        fetch("http://localhost:8080/tasks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },        
        })
            .then((response) => response.json())
            .then((actualData) => {
                setData(actualData.taskResponses);
            })
            .catch((err) => {
                console.error(err.message);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = (task, newStatus) => {
        const updatedTask = { ...task, status: newStatus };

        fetch(`http://localhost:8080/tasks/${task.id}/${newStatus}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        })
            .then((response) => response.json())
            .then(() => {
                fetchData();
            })
            .catch((error) => {
                console.error("Error updating task:", error);
            });
    };

    const groupedTasks = {
        "To Do": data.filter((task) => task.status === "To Do"),
        "In Progress": data.filter((task) => task.status === "In Progress"),
        Done: data.filter((task) => task.status === "Done"),
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="task-board">
                <div className="columns">
                    {Object.keys(groupedTasks).map((status) => (
                        <Column
                            key={status}
                            status={status}
                            tasks={groupedTasks[status]}
                            onDrop={handleStatusChange}
                        />
                    ))}
                </div>
                <button className="plus-button" onClick={() => setIsModalOpen(true)}>
                    <img src={plusLogo} alt="Add Task" />
                </button>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <Form />
                </Modal>
            </div>
        </DndProvider>
    );
}
