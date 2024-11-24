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
  const [employeeDivision, setEmployeeDivision] = useState("");
  const [equipmentId, setEquipmentId] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const data = {
      employeeDivision: employeeDivision,
      equipmentId: equipmentId,
      startDate: startDate,
      endDate: endDate,
    };
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/equipment/division", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${{ token }}`,
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
        <label htmlFor="employeeDivision">employeeDivision</label>
        <input
          className="form-control"
          id="employeeDivision"
          value={employeeDivision}
          onChange={(e) => setEmployeeDivision(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="equipmentId">equipmentId</label>
        <input
          type="number"
          className="form-control"
          id="equipmentId"
          value={equipmentId}
          onChange={(e) => setEquipmentId(Number(e.target.value))}
        />
      </div>
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
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default function EnterpriseEquipmentPossessionTable() {
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

    fetch(`http://localhost:8080/equipment/division`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((actualData) => {
        console.log(actualData);
        setData(actualData.equipmentPossessionResponses);
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
        <p className="Table-header">Выданное оборудование</p>
        <tbody>
          <tr>
            <th onClick={() => handleSort("enterpriseEquipmentId")}>
              Enterprise equipment id{" "}
              {getSortIndicator("enterpriseEquipmentId")}
            </th>
            <th onClick={() => handleSort("employeeId")}>
              Employee id {getSortIndicator("employeeId")}
            </th>
            <th onClick={() => handleSort("startDate")}>
              Start date {getSortIndicator("startDate")}
            </th>
            <th onClick={() => handleSort("endDate")}>
              End date {getSortIndicator("endDate")}
            </th>
          </tr>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.enterpriseEquipmentId}</td>
              <td>{item.employeeId}</td>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
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
