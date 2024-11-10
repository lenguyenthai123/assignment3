// src/Register/Register.js
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import Notification from "../Notification/Notification"; // Import component thông báo

function Register() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Sử dụng biến môi trường cho URL của backend

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [notification, setNotification] = useState(null); // Trạng thái thông báo

  const onSubmit = (data) => {
    setLoading(true); // Bắt đầu loading
    axios
      .post(`${backendUrl}/user/register`, data)
      .then((response) => {
        if (response.data.statusCode === "SUCCESS") {
          setNotification({ message: "Đăng ký thành công", type: "success" });
          navigate("/login"); // Chuyển hướng đến trang đăng nhập
        } else {
          setNotification({
            message: `Lỗi: ${response.data.message}`,
            type: "error",
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setNotification({
            message: `${error.response.data.message}`,
            type: "error",
          });
        } else {
          setNotification({ message: `Lỗi: ${error.message}`, type: "error" });
        }
      })
      .finally(() => {
        setLoading(false); // Kết thúc loading
      });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000); // Thông báo tự động đóng sau 5 giây
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="register-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
      <div className="register-card">
        <h2 className="register-title">Đăng Ký</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="register-field">
            <label>Email</label>
            <input
              type="email"
              className={`register-input ${
                errors.email ? "border-red-500" : ""
              }`}
              {...register("email", {
                required: "Email là bắt buộc",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Địa chỉ email không hợp lệ",
                },
              })}
            />
            {errors.email && (
              <p className="register-error">{errors.email.message}</p>
            )}
          </div>

          {/* Thêm các trường đăng ký khác tương tự */}
          <div className="register-field">
            <label>Mật khẩu</label>
            <input
              type="password"
              className={`register-input ${
                errors.password ? "border-red-500" : ""
              }`}
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                minLength: {
                  value: 6,
                  message: "Độ dài tối thiểu là 6 ký tự",
                },
              })}
            />
            {errors.password && (
              <p className="register-error">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? <div className="spinner-register"></div> : "Đăng Ký"}
          </button>
        </form>

        <div className="register-footer">
          <p className="register-text">Đã có tài khoản?&nbsp; </p>

          <Link to="/login" className="login-link">
            <button className="login-button"> Đăng Nhập Ngay</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
