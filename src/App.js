import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import ProtectedRoute from "./ProtectedRoute";
import MainPageEmployee from "./MainPageEmployee";

const App = () => {
  return (
    <Router>
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/main"
    element={
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    }
  />
  <Route
  path="/main-employee"
  element={
    <ProtectedRoute>
      <MainPageEmployee />
    </ProtectedRoute>
  }
  />
</Routes>
    </Router>
  );
}; 

export default App;
