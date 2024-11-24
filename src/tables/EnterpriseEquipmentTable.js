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
  const [type, setType] = useState("");
  const [serialNumber, setSerialNumber] = useState(0);
  const [description, setDescription] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const data = {
      type: type,
      serialNumber: serialNumber,
      description: description,
    };
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/equipment", {
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
        <label htmlFor="type">Type</label>
        <input
          className="form-control"
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="serialNumber">Serial Number</label>
        <input
          type="number"
          className="form-control"
          id="serialNumber"
          value={serialNumber}
          onChange={(e) => setSerialNumber(Number(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          className="form-control"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

export default function EnterpriseEquipmentTable() {
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

    fetch(`http://localhost:8080/equipment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((actualData) => {
        console.log(actualData);
        setData(actualData.equipmentResponses);
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
        <p className="Table-header">Оборудование</p>
        <tbody>
          <tr>
          <th onClick={() => handleSort("id")}>
              id {getSortIndicator("id")}
            </th>
            <th onClick={() => handleSort("type")}>
              Type {getSortIndicator("type")}
            </th>
            <th onClick={() => handleSort("serialNumber")}>
              Serial number {getSortIndicator("serialNumber")}
            </th>
            <th onClick={() => handleSort("description")}>
              Description {getSortIndicator("description")}
            </th>
          </tr>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.type}</td>
              <td>{item.serialNumber}</td>
              <td>{item.description}</td>
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
