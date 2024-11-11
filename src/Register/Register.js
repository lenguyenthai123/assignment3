// src/Register.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios"; // Sử dụng axios bình thường
import { useNavigate } from "react-router-dom";
import Notification from "../Notification/Notification";
import "./Register.css"; // Import file CSS riêng

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/register`,
        {
          username: data.username,
          email: data.email,
          password: data.password,
        }
      );

      if (response.data.statusCode === "SUCCESS") {
        setNotification({
          message: "Đăng ký thành công! Vui lòng đăng nhập.",
          type: "success",
        });
        // Chuyển hướng sau khi đăng ký thành công
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setNotification({
          message: `Lỗi: ${response.data.message}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setNotification({
        message: `Lỗi: ${error.response.data.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

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
          {/* Username Field */}
          <div className="register-field">
            <label>Username</label>
            <input
              type="text"
              className={`register-input ${
                errors.username ? "border-red-500" : ""
              }`}
              {...register("username", {
                required: "Username là bắt buộc",
                minLength: {
                  value: 3,
                  message: "Username phải có ít nhất 3 ký tự",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "Username chỉ chứa chữ cái, số và dấu gạch dưới",
                },
              })}
            />
            {errors.username && (
              <p className="register-error">{errors.username.message}</p>
            )}
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Submit Button */}
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? <div className="spinner-register"></div> : "Đăng Ký"}
          </button>
        </form>

        {/* Đường dẫn đăng nhập nếu đã có tài khoản */}
        <div className="register-footer">
          <p className="register-text">
            Đã có tài khoản?&nbsp;
            <button
              className="register-login-link"
              onClick={() => navigate("/login")}
            >
              Đăng Nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
