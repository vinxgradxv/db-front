import React, { useState, useEffect } from "react";
import "./Table.css";
import plusLogo from "../icons/icons8-plus-64.png";

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

const Form = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [complexity, setComplexity] = useState();
  const [status, setStatus] = useState();
  const [productivityStatisticsId, setProductivityStatisticsId] = useState();

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const data = {
      startDate: startDate,
      endDate: endDate,
      complexity: complexity,
      status: status,
      productivityStatisticsId: productivityStatisticsId,
    };
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Успех");
        console.log("Success:", data);
      })
      .catch((error) => {
        alert("Error: " + error);
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="form-group">
        <label htmlFor="startDate">startDate</label>
        <input
          type="date"
          className="form-control"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="endDate">endDate</label>
        <input
          type="date"
          className="form-control"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="complexity">complexity</label>
        <input
          type={"number"}
          className="form-control"
          id="complexity"
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="status">status</label>
        <input
          className="form-control"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="productivityStatisticsId">
          productivityStatisticsId
        </label>
        <input
          type={"number"}
          className="form-control"
          id="productivityStatisticsId"
          value={productivityStatisticsId}
          onChange={(e) => setProductivityStatisticsId(e.target.value)}
        />
      </div>
      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default function TaskTable() {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  //сортировка
  const handleSort = (key) => {
    let direction = "ascending";

    // Циклическое переключение состояний
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null; // Сброс сортировки
      }
    }

    setSortConfig({ key, direction });

    // Применение сортировки
    if (direction) {
      const sortedData = [...data].sort((a, b) => {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      });
      setData(sortedData);
    } else {
      // Если сортировка сброшена, верните данные к исходному состоянию
      fetchData(); // Или храните оригинальные данные для сброса
    }
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") return "↑";
      if (sortConfig.direction === "descending") return "↓";
    }
    return ""; // Пусто для состояния "без сортировки"
  };

  //сортировка

  const fetchData = () => {
    const token = localStorage.getItem("authToken");

    fetch(`http://localhost:8080/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((actualData) => {
        console.log(actualData);
        setData(actualData.taskResponses);
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={"content-div"}>
      <div className="left-div">
        <p className="Table-header">Рабочие задачи</p>
        <tbody>
          <tr>
            <th onClick={() => handleSort("startDate")}>
              Start Date {getSortIndicator("startDate")}
            </th>
            <th onClick={() => handleSort("endDate")}>
              End Date {getSortIndicator("endDate")}
            </th>
            <th onClick={() => handleSort("complexity")}>
              Complexity {getSortIndicator("complexity")}
            </th>
            <th onClick={() => handleSort("status")}>
              Status {getSortIndicator("status")}
            </th>
            <th onClick={() => handleSort("ProductivityStatisticsId")}>
              Productivity Statistics Id{" "}
              {getSortIndicator("ProductivityStatisticsId")}
            </th>
          </tr>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
              <td>{item.complexity}</td>
              <td>{item.status}</td>
              <td>{item.productivityStatisticsId}</td>
            </tr>
          ))}
        </tbody>
      </div>
      <div className={"right-div"}>
        <button onClick={openModal}>
          <img src={plusLogo} alt="add entity" />
        </button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <Form />
        </Modal>
      </div>
    </div>
  );
}
