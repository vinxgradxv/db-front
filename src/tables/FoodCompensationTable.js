import React, { useState, useEffect } from "react";
import "./Table.css";
import plusLogo from "../icons/icons8-plus-64.png";
import cancelLogo from "../icons/icons8-money-buring-isolated-on-a-white-background-48.png";

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
  const [paymentAmount, setPaymentAmount] = useState();
  const [compensationDate, setCompensationDate] = useState();
  const [isBreakfast, setIsBreakfast] = useState();
  const [employeeId, setEmployeeId] = useState();

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const data = {
      paymentAmount: paymentAmount,
      compensationDate: compensationDate,
      isBreakfast: isBreakfast,
      employeeId: employeeId,
    };
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/food-compensation", {
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
        <label htmlFor="paymentAmount">paymentAmount</label>
        <input
          type={"number"}
          className="form-control"
          id="paymentAmount"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(Number(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="compensationDate">compensationDate</label>
        <input
          type="date"
          className="form-control"
          id="compensationDate"
          value={compensationDate}
          onChange={(e) => setCompensationDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="isBreakfast">isBreakfast</label>
        <input
          type="checkbox"
          className="form-control"
          id="isBreakfast"
          value={isBreakfast}
          onChange={(e) => setIsBreakfast(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="employeeId">employeeId</label>
        <input
          type={"number"}
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

export default function FoodCompensationTable() {
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

    fetch(`http://localhost:8080/food-compensation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((actualData) => {
        console.log(actualData);
        setData(actualData.foodCompensationResponses);
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
    setIsModalOpenCancel(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isModalOpenCancel, setIsModalOpenCancel] = useState(false);

  const openModalCancel = () => {
    setIsModalOpenCancel(true);
    setIsModalOpen(false);
  };

  const closeModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={"content-div"}>
      <div className="left-div">
        <p className="Table-header">Компенсация питания</p>
        <tbody>
          <tr>
            <th onClick={() => handleSort("paymentAmount")}>
              Payment amount {getSortIndicator("paymentAmount")}
            </th>
            <th onClick={() => handleSort("compensationDate")}>
              Compensation date {getSortIndicator("compensationDate")}
            </th>
            <th onClick={() => handleSort("isBreakfest")}>
              Is Breakfast {getSortIndicator("isBreakfest")}
            </th>
            <th onClick={() => handleSort("employeeId")}>
              Employee Id {getSortIndicator("employeeId")}
            </th>
          </tr>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.paymentAmount}</td>
              <td>{item.compensationDate}</td>
              <td>{item.isBreakfast}</td>
              <td>{item.employeeId}</td>
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
        <button onClick={openModalCancel}>
          <img src={cancelLogo} alt="cancel" />
        </button>
        <Modal isOpen={isModalOpenCancel} onClose={closeModalCancel}>
          <FormCancel />
        </Modal>
      </div>
    </div>
  );
}

const FormCancel = () => {
  const [employeeId, setEmployeeId] = useState();

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const data = {
      employeeId: employeeId,
    };
    const token = localStorage.getItem("authToken");

    fetch(
      `http://localhost:8080/food-compensation/${employeeId}/cancellation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )
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
