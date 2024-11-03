import React from "react";
import Masonry from "react-masonry-css"; // Sử dụng thư viện Masonry để sắp xếp ảnh theo dạng lưới
import { Link } from "react-router-dom"; // Link để điều hướng đến trang chi tiết ảnh
import "./PhotoList.css"; // Import file CSS cho component

function PhotoList({ photos }) {
  // Cấu hình số cột của lưới Masonry theo kích thước màn hình
  const breakpointColumnsObj = {
    default: 3, // 3 cột cho kích thước màn hình mặc định
    1100: 3, // 3 cột cho màn hình có chiều rộng >= 1100px
    700: 2, // 2 cột cho màn hình có chiều rộng >= 700px
    500: 1, // 1 cột cho màn hình có chiều rộng >= 500px
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj} // Cấu hình số cột cho grid Masonry
      className="my-masonry-grid" // Class cho grid Masonry
      columnClassName="my-masonry-grid_column" // Class cho từng cột của grid Masonry
    >
      {/* Duyệt qua danh sách ảnh và hiển thị từng ảnh */}
      {photos.map((photo) => (
        <Link
          key={photo.id}
          to={`/home/photos/${photo.slug}-${photo.id}`}
          className="photo-item"
        >
          {/* Ảnh thu nhỏ của từng photo */}
          <img
            src={photo.urls.small} // URL ảnh nhỏ
            alt={photo.alt_description} // Alt text cho ảnh
            className="photo-img" // Class CSS cho ảnh
          />
          {/* Hiển thị thông tin tác giả của ảnh */}
          <div className="photo-author">
            <img
              src={photo.user.profile_image.medium} // Ảnh đại diện của tác giả
              alt={photo.user.name} // Alt text cho ảnh đại diện
              className="author-img" // Class CSS cho ảnh đại diện
            />
            <p className="author-text">{photo.user.name}</p> {/* Tên tác giả */}
          </div>
        </Link>
      ))}
    </Masonry>
  );
}

export default PhotoList;
