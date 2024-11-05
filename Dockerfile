# Sử dụng image Nginx để phục vụ ứng dụng React
FROM nginx:alpine

# Sao chép thư mục build của ứng dụng React vào thư mục mặc định của Nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY build/ /usr/share/nginx/html

# Expose port 80 để truy cập vào ứng dụng
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]