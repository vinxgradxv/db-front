import React, { useState, useEffect } from "react";
import "./Table.css";
import plusLogo from "../icons/icons8-plus-64.png";
import minusLogo from "../icons/icons8-minus-64.png";

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
  const [age, setAge] = useState(0);
  const [division, setDivision] = useState("");
  const [adminId, setAdminId] = useState(0);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const data = {
      name: name,
      age: age,
      division: division,
      adminId: adminId,
    };

    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/employees", {
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
        <label htmlFor="name">Name</label>
        <input
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          className="form-control"
          id="age"
          placeholder="69"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="division">Division</label>
        <input
          className="form-control"
          id="division"
          value={division}
          onChange={(e) => setDivision(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="adminId">Admin id</label>
        <input
          type="number"
          className="form-control"
          id="age"
          placeholder="69"
          value={adminId}
          onChange={(e) => setAdminId(Number(e.target.value))}
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

export default function EmployeeTable() {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  //удаление
  const handleDelete = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
      const token = localStorage.getItem("authToken");

      fetch(`http://localhost:8080/employees/${id}`, {
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

    fetch(`http://localhost:8080/employees`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((actualData) => {
        console.log(actualData);
        setData(actualData.employeeResponses);
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
    setIsModalOpenFire(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isModalOpenFire, setIsModalOpenFire] = useState(false);

  const openModalFire = () => {
    setIsModalOpenFire(true);
    setIsModalOpen(false);
  };

  const closeModalFire = () => {
    setIsModalOpenFire(false);
  };

  return (
    <div className={"content-div"}>
      <div className="left-div">
        <p className="Table-header">Сотрудники</p>
        <tbody>
          <tr>
          <th onClick={() => handleSort("id")}>
              id {getSortIndicator("id")}
            </th>
            <th onClick={() => handleSort("name")}>
              name {getSortIndicator("name")}
            </th>
            <th onClick={() => handleSort("age")}>
              age {getSortIndicator("age")}
            </th>
            <th onClick={() => handleSort("division")}>
              division {getSortIndicator("division")}
            </th>
            <th onClick={() => handleSort("adminId")}>
              adminId {getSortIndicator("adminId")}
            </th>
            <th>Delete</th>
          </tr>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>{item.division}</td>
              <td>{item.adminId}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>
                  <img src={minusLogo} alt="delete" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </div>
    </div>
  );
}

const FormFire = () => {
  const [employeeId, setEmployeeId] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const data = {
      employeeId: employeeId,
    };
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/employee/fire", {
      method: "DELETE",
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
        <label htmlFor="employeeId">employeeId</label>
        <input
          type={"number"}
          className="form-control"
          id="employeeId"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
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
