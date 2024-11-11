// src/Profile.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios"; // Sử dụng axios bình thường
import { AuthContext } from "../Context/AuthContext";
import Notification from "../Notification/Notification";
import { useNavigate } from "react-router-dom";
import "./Profile.css"; // Import file CSS riêng
import icon from '../assets/iconDefault.png'; // Import icon mặc định

const Profile = () => {
  const { token, logout } = useContext(AuthContext); // Lấy token và logout từ AuthContext
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gắn header Authorization thủ công
            },
          }
        );
        if (response.data.statusCode === "200") {
          setProfile(response.data.data);
        } else {
          setNotification({
            message: `Lỗi: ${response.data.message}`,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setNotification({
          message: "Không thể lấy thông tin cá nhân. Vui lòng thử lại.",
          type: "error",
        });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
      <div className="profile-card">
        <div className="profile-header">
          <img
            className="profile-avatar"
            src={profile?.avatar || icon}
            alt="Avatar"
          />
          <h2 className="profile-name">{profile?.username || "Người dùng"}</h2>
          <p className="profile-email">{profile?.email}</p>
        </div>

        <div className="profile-details">
          <h3 className="profile-details-title">Thông Tin Chi Tiết</h3>
          <div className="profile-info">
            <div className="profile-info-item">
              <span className="profile-info-label">Tên:</span>
              <span className="profile-info-value">
                {profile?.username || "N/A"}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Email:</span>
              <span className="profile-info-value">
                {profile?.email || "N/A"}
              </span>
            </div>
            {profile?.phone && (
              <div className="profile-info-item">
                <span className="profile-info-label">Số Điện Thoại:</span>
                <span className="profile-info-value">{profile.phone}</span>
              </div>
            )}
            {profile?.address && (
              <div className="profile-info-item">
                <span className="profile-info-label">Địa Chỉ:</span>
                <span className="profile-info-value">{profile.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="profile-logout">
          <button onClick={handleLogout} className="logout-button">
            Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
