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
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const data = {
      name: name,
      category: category,
      description: description,
    };
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
        `Bearer ${token}`
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
        <label htmlFor="name">Name</label>
        <input
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <label htmlFor="category">Category</label>
        <input
          className="form-control"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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

export default function CourseTable() {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  //редактирование
  const EditForm = ({ course, onSave, onCancel }) => {
    const [name, setName] = useState(course.name);
    const [description, setDescription] = useState(course.description);
    const [category, setCategory] = useState(course.category);

    const handleSubmit = (event) => {
      event.preventDefault();

      const updatedData = { name, description, category };
      const token = localStorage.getItem("authToken");

      fetch(`http://localhost:8080/courses/${course.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${token}`,
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
          <label htmlFor="name">Name</label>
          <input
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label htmlFor="category">Category</label>
          <input
            className="form-control"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
    const token = localStorage.getItem("authToken");

    if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
      fetch(`http://localhost:8080/courses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${token}`,
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

    fetch(`http://localhost:8080/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((actualData) => {
        console.log(actualData);
        setData(actualData.courseResponses);
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
        <p className="Table-header">Курсы</p>
        <tbody>
          <tr>
          <th onClick={() => handleSort("id")}>
              id {getSortIndicator("id")}
            </th>
            <th onClick={() => handleSort("name")}>
              Name {getSortIndicator("name")}
            </th>
            <th onClick={() => handleSort("description")}>
              Description {getSortIndicator("description")}
            </th>
            <th onClick={() => handleSort("category")}>
              Category {getSortIndicator("category")}
            </th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
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
