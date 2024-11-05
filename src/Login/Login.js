// Login.js
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Cookies from "js-cookie"; // Thêm import này

function Login() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Sử dụng biến môi trường cho URL của backend

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    axios
      .post(`${backendUrl}/user/login`, data)
      .then((response) => {
        const result = response.data;
        if (response.data.statusCode === "SUCCESS") {
          Cookies.set("accessToken", result.data, { expires: 7 }); // Lưu accessToken trong cookie
          alert("Đăng nhập thành công");
          navigate("/home"); // Chuyển hướng đến trang chủ hoặc trang mong muốn
        } else {
          alert(`Lỗi: ${result.message}`);
        }
      })
      .catch((error) => {
        alert(`Lỗi: ${error.message}`);
      });
  };

  return (
    <div className="login-container">
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

          <button type="submit" className="login-button">
            Đăng Nhập
          </button>
        </form>

        <div className="login-footer">
          <p className="login-text">Chưa có tài khoản? </p>
          <Link to="/register" className="register-link">
            <button className="register-button">Đăng Ký Ngay</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
