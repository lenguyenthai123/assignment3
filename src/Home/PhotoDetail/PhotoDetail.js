import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./PhotoDetail.css";

function PhotoDetail() {
  const { slugId } = useParams(); // Lấy id từ URL
  const id = slugId.split("-").pop(); // Lấy id từ slugId
  const [photo, setPhoto] = useState(null); // State để lưu trữ ảnh chi tiết
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu từ API
  const [imageLoading, setImageLoading] = useState(true); // State để theo dõi trạng thái tải ảnh đầy đủ
  const [message, setMessage] = useState("Loading photo..."); // Tin nhắn hiển thị khi đang tải ảnh
  const [error, setError] = useState(null); // State để lưu trữ thông báo lỗi (nếu có)
  const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY; // API Key của Unsplash, thay bằng giá trị thực

  useEffect(() => {
    // Hàm fetch dữ liệu ảnh từ API Unsplash
    const fetchPhoto = async () => {
      try {
        setMessage("Loading photo..."); // Đặt lại tin nhắn khi bắt đầu fetch
        setLoading(true); // Đặt trạng thái loading khi bắt đầu fetch
        setImageLoading(true); // Đặt trạng thái để hiển thị spinner khi ảnh đang tải

        //console.log("id", id);
        const response = await fetch(
          `https://api.unsplash.com/photos/${id}?client_id=${accessKey}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch photo"); // Ném lỗi nếu phản hồi không thành công
        }
        const data = await response.json(); // Parse dữ liệu JSON từ API
        setPhoto(data); // Cập nhật state với dữ liệu ảnh
        setLoading(false); // Kết thúc trạng thái loading khi fetch hoàn tất
      } catch (error) {
        console.error("Error fetching photo:", error); // In lỗi ra console
        setMessage("Failed to load photo"); // Cập nhật tin nhắn lỗi
        setError(error.message); // Lưu thông báo lỗi vào state
        setLoading(false); // Dừng trạng thái loading nếu có lỗi
      }
    };

    fetchPhoto(); // Gọi hàm fetch khi component được mount
  }, [slugId, accessKey]); // Chạy lại effect khi id hoặc accessKey thay đổi

  // Hàm xử lý khi ảnh đầy đủ đã tải xong
  const handleImageLoad = () => {
    setImageLoading(false); // Ẩn spinner khi ảnh đã tải xong
  };

  // Hiển thị spinner trong khi đang tải dữ liệu ảnh
  if (loading) {
    return (
      <div className="photo-detail p-4">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">{message}</div>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo lỗi nếu có lỗi xảy ra khi tải dữ liệu
  if (error) {
    return <div className="error-message">{message}</div>;
  }

  // Hiển thị chi tiết ảnh khi đã tải xong
  return (
    <div className="photo-detail">
      {/* Link quay lại trang danh sách ảnh */}
      <Link to="/home" className="back-link">
        Back to Gallery
      </Link>
      {photo && (
        <div className="photo-detail-content">
          <div className="relative">
            {/* Hiển thị spinner cho đến khi ảnh đầy đủ được tải */}
            {imageLoading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Loading image...</div>
              </div>
            )}

            {/* Hiển thị ảnh đầy đủ */}
            <img
              src={photo === null ? null : photo.urls.full} // URL ảnh đầy đủ
              alt={photo.description} // Alt text cho ảnh
              className="photo-detail-image" // Class CSS cho ảnh
              onLoad={handleImageLoad} // Gọi hàm khi ảnh được tải xong
              //loading="lazy" // Tùy chọn lazy loading (có thể bật)
              style={{ display: imageLoading ? "none" : "block" }} // Ẩn ảnh cho đến khi ảnh tải xong
            />
          </div>
          {/* Hiển thị mô tả của ảnh */}
          <h2 className="photo-title">{photo.alt_description || "Untitled"}</h2>
          <div className="photo-author1">
            {/* Liên kết đến tài khoản Instagram của tác giả */}
            <a
              href={`https://www.instagram.com/${photo.user.instagram_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="author-img1"
            >
              <img
                className="author-img1" // Class CSS cho ảnh đại diện của tác giả
                src={photo.user.profile_image.medium} // URL ảnh đại diện của tác giả
                alt={photo.user.name} // Alt text cho ảnh đại diện
              />
            </a>
            {/* Tên tác giả và liên kết đến Instagram */}
            <a
              href={`https://www.instagram.com/${photo.user.instagram_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="author-text1"
            >
              {photo.user.name}
            </a>
          </div>
          {/* Hiển thị mô tả chi tiết của ảnh, nếu không có, hiển thị alt description */}
          <p className="photo-description">
            {photo.description ||
              photo.alt_description ||
              "No description available."}
          </p>
        </div>
      )}
    </div>
  );
}

export default PhotoDetail;
