// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Register from "./Register/Register";
import PhotoDetail from "./Home/PhotoDetail/PhotoDetail";
import MasonryGrid from "./Home//PhotoList/PhotoList";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Điều hướng từ trang chủ "/" đến "/home" */}
          <Route path="/" element={<Navigate to="/home" />} />
          {/* Đường dẫn cho trang home */}
          <Route path="/home/*" element={<Home />} />
          {/* Đường dẫn cho trang danh sách ảnh */}
          <Route path="/home/photos" element={<MasonryGrid />} />
          {/* Đường dẫn cho trang chi tiết ảnh */}
          <Route path="/home/photos/:slugId" element={<PhotoDetail />} />
          {/* Đường dẫn cho trang login */}
          <Route path="/login" element={<Login />} />
          {/* Đường dẫn cho trang register */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
