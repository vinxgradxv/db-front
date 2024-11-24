import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login"); // "admin", "employee", "login"
  const [formData, setFormData] = useState({
    name: "",
    division: "",
    age: 0,
    adminId: 0,
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Обработчик смены вкладки
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setFormData({
      name: "",
      division: "",
      age: 0,
      adminId: 0,
      email: "",
      password: "",
    });
  };

  // Общий обработчик ввода данных
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Обработчик для всех форм
  const handleSubmit = (e) => {
    e.preventDefault();

    let endpoint = "";
    let body = {};

    switch (activeTab) {
      case "admin":
        endpoint = "http://localhost:8080/auth/admin";
        body = {
          name: formData.name,
          age: formData.age,
          division: formData.division,
          email: formData.email,
          password: formData.password
        };
        break;

      case "employee":
        endpoint = "http://localhost:8080/auth/employee";
        body = {
            name: formData.name,
            age: formData.age,
            adminId: formData.adminId,
            division: formData.division,
            email: formData.email,
            password: formData.password
          };
        break;

      case "login":
        endpoint = "http://localhost:8080/auth/authenticate";
        body = {
            email: formData.email,
            password: formData.password
        };
        break;

      default:
        return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка при выполнении операции");
        }
        return response.json();
      })
      .then((data) => {
        if (activeTab === "login") {
          // Сохраняем токен и переходим на основную страницу
          localStorage.setItem("authToken", data.access_token);
          navigate("/main");
        } else {
          alert("Регистрация успешна!");
          handleTabChange("login");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Произошла ошибка. Проверьте введенные данные.");
      });
  };

  return (
    <div className="login-container">
      <h2>Авторизация</h2>
      <div className="tabs">
        <button
          className={activeTab === "login" ? "active" : ""}
          onClick={() => handleTabChange("login")}
        >
          Авторизация
        </button>
        <button
          className={activeTab === "admin" ? "active" : ""}
          onClick={() => handleTabChange("admin")}
        >
          Регистрация администратора
        </button>
        <button
          className={activeTab === "employee" ? "active" : ""}
          onClick={() => handleTabChange("employee")}
        >
          Регистрация сотрудника
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === "login" && (
          <>
            <div className="form-group">
              <label htmlFor="email">email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        {activeTab === "admin" && (
          <>
            <div className="form-group">
              <label htmlFor="name">Имя администратора</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Возраст</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="division">Отдел</label>
              <input
                type="text"
                id="division"
                name="division"
                value={formData.division}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        {activeTab === "employee" && (
          <>
            <div className="form-group">
              <label htmlFor="name">Имя сотрудника</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Возраст</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="adminId">ID администратора</label>
              <input
                type="number"
                id="adminId"
                name="adminId"
                value={formData.adminId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="division">Отдел</label>
              <input
                type="text"
                id="division"
                name="division"
                value={formData.division}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn btn-primary">
          {activeTab === "login"
            ? "Войти"
            : activeTab === "admin"
            ? "Зарегистрировать администратора"
            : "Зарегистрировать сотрудника"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
