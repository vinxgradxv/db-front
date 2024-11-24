import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import ProtectedRoute from "./ProtectedRoute";

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
</Routes>
    </Router>
  );
}; 

export default App;
