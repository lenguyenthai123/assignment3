// Login.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Cookies from "js-cookie"; // Thêm import này
import Notification from "../Notification/Notification"; // Import component thông báo

function Login() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Sử dụng biến môi trường cho URL của backend

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [notification, setNotification] = useState(null); // Thêm trạng thái thông báo

  const onSubmit = (data) => {
    setLoading(true); // Bắt đầu loading
    axios
      .post(`${backendUrl}/user/login`, data)
      .then((response) => {
        const result = response.data;
        if (response.data.statusCode === "SUCCESS") {
          Cookies.set("accessToken", result.data, { expires: 7 }); // Lưu accessToken trong cookie
          setNotification({ message: "Đăng nhập thành công", type: "success" });
          navigate("/home"); // Chuyển hướng đến trang chủ hoặc trang mong muốn
        } else {
          console.log(result);
          setNotification({ message: `Lỗi: ${result.message}`, type: "error" });
        }
      })
      .catch((error) => {
        console.log(error);
        setNotification({
          message: ` ${error.response.data.message}`,
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false); // Kết thúc loading
      });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="login-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
      <div className="login-card">
        <h2 className="login-title">Đăng Nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              className={`login-input ${errors.email ? "border-red-500" : ""}`}
              {...register("email", {
                required: "Email là bắt buộc",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Địa chỉ email không hợp lệ",
                },
              })}
            />
            {errors.email && (
              <p className="login-error">{errors.email.message}</p>
            )}
          </div>

          <div className="login-field">
            <label>Mật khẩu</label>
            <input
              type="password"
              className={`login-input ${
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
              <p className="login-error">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <div className="spinner-login"></div> : "Đăng Nhập"}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-text">Chưa có tài khoản?&nbsp; </p>

          <Link to="/register" className="register-link">
            <button className="register-button"> Đăng Ký Ngay</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
