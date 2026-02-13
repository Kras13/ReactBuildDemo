import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import CarList from "./components/CarList";
import CarDetails from "./components/CarDetails";
import Register from "./components/Register";
import Login from "./components/Login";
import { jwtDecode } from "jwt-decode";
import CreateCar from "./components/CreateCar";
import UserCars from "./components/UserCars";
import EditCar from "./components/EditCar";

function App() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        setUsername(decoded.sub || null);
      } catch (error) {
        console.error("Failed to decode JWT token:", error);
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  }, []);

  const handleLogin = (username: string) => {
    setUsername(username);
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Car catalog
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {localStorage.getItem("jwtToken") == null ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              ) : null}
              {localStorage.getItem("jwtToken") == null && (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
            </ul>
            <ul className="nav justify-content-end">
              {username && (
                <li className="nav-item">
                  <Link className="nav-link" to="/Car/Add">
                    Add car
                  </Link>
                </li>
              )}
            </ul>
            <ul className="nav justify-content-end">
              {username && (
                <li className="nav-item">
                  <Link className="nav-link" to="/my/cars">
                    My cars
                  </Link>
                </li>
              )}
            </ul>
            <ul className="nav justify-content-end">
              {username && (
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    {username}
                  </Link>
                </li>
              )}
            </ul>
            <ul className="nav justify-content-end">
              {username && (
                <li
                  className="nav-item"
                  onClick={() => {
                    localStorage.removeItem("jwtToken");
                    setUsername(null);
                  }}
                >
                  <Link className="nav-link" to="#">
                    Log out
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={<CarList />} />
        <Route path="/car/:carId" element={<CarDetails />} />
        <Route path="/car/Add" element={<CreateCar />} />
        <Route path="/my/cars" element={<UserCars />} />
        <Route path="/edit/car/:carId" element={<EditCar />} />
      </Routes>
    </Router>
  );
}

export default App;
