// Home.js
import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import MasonryGrid from "./PhotoList/PhotoList";
import PhotoDetail from "./PhotoDetail/PhotoDetail";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  // Quản lý trạng thái cho các ảnh, trang hiện tại, và trạng thái tải dữ liệu
  const [photos, setPhotos] = useState([]);
  const [photoIds, setPhotoIds] = useState(new Set()); // Đảm bảo ảnh không bị lặp lại
  const [page, setPage] = useState(1); // Trang hiện tại để tải ảnh
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [hasMore, setHasMore] = useState(true); // Kiểm tra xem còn ảnh để tải không
  const [error, setError] = useState(null); // Lưu trữ thông báo lỗi (nếu có)

  // API Key của Unsplash, thay bằng giá trị thực của bạn
  const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Sử dụng biến môi trường cho URL của backend

  // Kiểm tra token khi component được mount lần đầu tiên
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      navigate("/login");
    } else {
      axios
        .get(`${backendUrl}/home`, {
          headers: { Authorization: `${accessToken}` },
        })
        .then((response) => {
          if (response.status !== 200) {
            navigate("/login");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            navigate("/login");
          } else {
            console.error("Error verifying token:", error);
          }
        });
    }
  }, [navigate]);

  // Hàm fetch ảnh từ API Unsplash, sử dụng useCallback để tránh tạo lại hàm khi không cần thiết
  const fetchPhotos = useCallback(async () => {
    if (loading || !hasMore) return; // Không tải nếu đang tải hoặc không còn ảnh

    setLoading(true); // Đặt trạng thái tải về true
    setError(null); // Reset lại thông báo lỗi trước khi tải
    try {
      // Gọi API Unsplash để lấy ảnh
      const response = await fetch(
        `https://api.unsplash.com/photos?client_id=${accessKey}&page=${page}&per_page=15`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch photos"); // Ném lỗi nếu phản hồi không thành công
      }
      const data = await response.json(); // Parse dữ liệu từ API
      if (Array.isArray(data) && data.length > 0) {
        // Lọc các ảnh mới chưa có trong danh sách
        const newPhotos = data.filter((photo) => !photoIds.has(photo.id));
        // Cập nhật danh sách ảnh và photoIds để tránh trùng lặp
        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
        setPhotoIds(
          (prevIds) =>
            new Set([...prevIds, ...newPhotos.map((photo) => photo.id)])
        );
        // Tăng trang để load dữ liệu tiếp theo
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false); // Nếu không còn ảnh mới, đặt hasMore thành false
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError(error.message); // Cập nhật lỗi nếu có
    } finally {
      setLoading(false); // Đặt trạng thái tải về false sau khi hoàn thành
    }
  }, [accessKey, page, loading, hasMore, photoIds]);

  // Lấy dữ liệu ảnh khi component được mount lần đầu tiên
  useEffect(() => {
    fetchPhotos(); // Gọi hàm fetch ảnh
  }, []); // Chạy một lần duy nhất khi component mount

  // Lắng nghe sự kiện scroll để tải thêm ảnh khi người dùng kéo xuống cuối trang
  useEffect(() => {
    const handleScroll = () => {
      // Kiểm tra nếu người dùng cuộn gần cuối trang thì tải thêm ảnh
      if (
        window.innerHeight + document.documentElement.scrollTop + 2500 >=
          document.documentElement.scrollHeight &&
        !loading &&
        hasMore
      ) {
        console.log("Load more photos"); // In ra console khi tải thêm ảnh
        fetchPhotos(); // Gọi hàm fetch ảnh
      }
    };

    // Debounce hàm scroll để giảm số lần gọi hàm khi cuộn trang
    const debounceScroll = debounce(handleScroll, 20);

    // Thêm sự kiện scroll vào window
    window.addEventListener("scroll", debounceScroll);
    return () => window.removeEventListener("scroll", debounceScroll); // Xóa sự kiện khi component bị unmount
  }, [fetchPhotos, loading, hasMore]);

  // Kiểm tra token khi component được mount lần đầu tiên
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      navigate("/login");
    } else {
      axios
        .get("/user/auth/token", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          if (response.status !== 200) {
            navigate("/login");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            navigate("/login");
          } else {
            console.error("Error verifying token:", error);
          }
        });
    }
  }, [navigate]);

  return (
    <div className="home">
      <Routes>
        <Route
          path="/"
          element={
            <div className="photo-grid-container">
              <MasonryGrid photos={photos} />
              {/* Hiển thị spinner khi đang tải ảnh */}
              {loading && (
                <div className="loading-container1">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Loading...</div>
                </div>
              )}
              {/* Hiển thị thông báo lỗi nếu có lỗi xảy ra */}
              {error && <p className="error-message">{error}</p>}
              {/* Hiển thị thông báo khi không còn ảnh để tải */}
              {!hasMore && <p className="no-more">No more photos to load.</p>}
            </div>
          }
        />
        <Route path="photos/:slugId" element={<PhotoDetail />} />
      </Routes>
    </div>
  );
}

export default Home;

// Hàm debounce để giới hạn số lần gọi hàm scroll
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    // Xóa timeout trước đó
    clearTimeout(timeout);
    // Đặt timeout mới
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
