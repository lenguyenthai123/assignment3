// Register.js
import React from "react";
// Thêm vào phần import
import { useForm, useWatch } from "react-hook-form"; // Thay thế watch bằng useWatch
import { useNavigate, Link } from "react-router-dom"; // Thêm import này
import "./Register.css";
import axios from "axios"; // Thêm import axios

import Particles from "react-tsparticles";

function Register() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Sử dụng biến môi trường cho URL của backend

  const navigate = useNavigate(); // Khởi tạo hook điều hướng
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const password = useWatch({
    control,
    name: "password",
  });
  const onSubmit = (data) => {
    // Thêm vào hàm onSubmit
    if (data.password !== data.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }
    axios
      .post(`${backendUrl}/user/register`, data)
      .then((response) => {
        console.error(response);

        if (response.data.statusCode === "SUCCESS") {
          alert("Đăng ký thành công");
          console.log(response);
          navigate("/login"); // Chuyển hướng đến trang đăng nhập
        } else {
          alert(`Lỗi: ${response.data.message}`);
        }
      })
      .catch((error) => {
        if (error.response) {
          alert(`Lỗi: ${error.response.data.errMessage}`);
        } else {
          alert(`Lỗi: ${error.message}`);
        }
      })
      .finally(() => {
        // Thêm vào finally để ẩn loading
      });
  };

  return (
    <div className="register-container">
      <Particles className="particles-bg" /* ...Cấu hình Particles nếu có */ />
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
          <div className="register-field">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              className={`register-input ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              {...register("confirmPassword", {
                required: "Xác nhận mật khẩu là bắt buộc",
                validate: (value) =>
                  value === password || "Mật khẩu không khớp",
              })}
            />
            {errors.confirmPassword && (
              <p className="register-error">{errors.confirmPassword.message}</p>
            )}
          </div>{" "}
          <button type="submit" className="register-button">
            Đăng Ký
          </button>
        </form>

        <div className="register-footer">
          <p className="register-text">Đã có tài khoản?</p>
          <Link to="/login" className="login-link">
            <button className="login-button">Đăng Nhập Ngay</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
