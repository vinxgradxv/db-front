import React, { useState, useEffect } from "react";
import "./Table.css";
import plusLogo from "../icons/icons8-plus-64.png";
import minusLogo from "../icons/minus.svg";
import editLogo from "../icons/edit.svg";

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
  const [date, setDate] = useState();
  const [managerReview, setManagerReview] = useState();
  const [adminId, setAdminId] = useState();
  const [employeeId, setEmployeeId] = useState();

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const data = {
      date: date,
      managerReview: managerReview,
      adminId: adminId,
      employeeId: employeeId,
    };
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/stats", {
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
        <label htmlFor="date">date</label>
        <input
          type="date"
          className="form-control"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="managerReview">managerReview</label>
        <input
          className="form-control"
          id="managerReview"
          value={managerReview}
          onChange={(e) => setManagerReview(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="adminId">adminId</label>
        <input
          type="number"
          className="form-control"
          id="adminId"
          value={adminId}
          onChange={(e) => setAdminId(Number(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="employeeId">employeeId</label>
        <input
          type="number"
          className="form-control"
          id="employeeId"
          value={employeeId}
          onChange={(e) => setEmployeeId(Number(e.target.value))}
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

export default function ProductivityStatisticsTable() {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  //редактирование
  const EditForm = ({ stat, onSave, onCancel }) => {
    const [date, setDate] = useState(stat.date);
    const [managerReview, setManagerReview] = useState(stat.managerReview);
    const [adminId, setAdminId] = useState(stat.adminId);
    const [employeeId, setEmployeeId] = useState(stat.employeeId);

    const handleSubmit = (event) => {
      event.preventDefault();

      const updatedData = { date, managerReview, adminId, employeeId };
      const token = localStorage.getItem("authToken");

      fetch(`http://localhost:8080/stats/${stat.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => response.json())
        .then((data) => {
          onSave(data);
        })
        .catch((error) => {
          alert("Ошибка при обновлении!");
          console.error("Error:", error);
        });
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employeeId">date</label>
          <input
            className="form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="managerReview">managerReview</label>
          <input
            className="form-control"
            id="managerReview"
            value={managerReview}
            onChange={(e) => setManagerReview(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="adminId">adminId</label>
          <input
            className="form-control"
            id="adminId"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="employeeId">employeeId</label>
          <input
            className="form-control"
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button className="form-control btn btn-primary" type="submit">
            Save
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAdmin(null);
  };

  const handleEdit = (admin) => {
    openEditModal(admin);
  };

  const handleSaveEdit = (updatedAdmin) => {
    setData(
      data.map((item) => (item.id === updatedAdmin.id ? updatedAdmin : item))
    );
    closeEditModal();
  };
  //редактирование

  //удаление
  const handleDelete = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
      const token = localStorage.getItem("authToken");

      fetch(`http://localhost:8080/stats/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            alert("Успешно удалено!");
            setData(data.filter((item) => item.id !== id));
          } else {
            alert("Ошибка при удалении!");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Ошибка при удалении: " + error);
        });
    }
  };
  //удаление

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

    fetch(`http://localhost:8080/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((actualData) => {
        console.log(actualData);
        setData(actualData.productivityStatisticsResponses);
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
        <p className="Table-header">Статистика продутивности</p>
        <tbody>
          <tr>
            <th onClick={() => handleSort("date")}>
              date {getSortIndicator("date")}
            </th>
            <th onClick={() => handleSort("employeeId")}>
              employeeId {getSortIndicator("employeeId")}
            </th>
            <th onClick={() => handleSort("adminId")}>
              adminId {getSortIndicator("adminId")}
            </th>
            <th onClick={() => handleSort("managerReview")}>
              managerReview {getSortIndicator("managerReview")}
            </th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.managerReview}</td>
              <td>{item.employeeId}</td>
              <td>{item.adminId}</td>
              <td>
                <button onClick={() => handleEdit(item)}>
                  <img src={editLogo} alt="edit" />
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(item.id)}>
                  <img src={minusLogo} alt="delete" />
                </button>
              </td>
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
      {/* Модальное окно для редактирования */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        {editingAdmin && (
          <EditForm
            admin={editingAdmin}
            onSave={handleSaveEdit}
            onCancel={closeEditModal}
          />
        )}
      </Modal>
    </div>
  );
}
