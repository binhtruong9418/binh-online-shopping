# Hướng dẫn Cài dặt

## 1. Cài đặt môi trường phát triển

Trước tiên, bạn cần cài đặt một số công cụ cần thiết:

1. **Node.js và npm**: React yêu cầu Node.js và npm để quản lý các gói và chạy các lệnh.
    - Tải Node.js từ trang chủ: [Node.js](https://nodejs.org/)
    - Sau khi cài đặt, kiểm tra phiên bản bằng cách chạy lệnh:
      ```sh
      node -v
      npm -v
      ```

## 2. Clone repository từ GitHub

1. Mở terminal hoặc command prompt.
2. Di chuyển đến thư mục bạn muốn lưu dự án.
3. Sử dụng lệnh `git clone` để clone repository:
   ```sh
   git clone https://github.com/binhtruong9418/online-shopping-fe.git
4. Di chuyển vào thư mục dự án:
   ```sh
   cd project-2-fe

## 3. Cài đặt các gói cần thiết

1. Chạy lệnh sau để cài đặt các gói cần thiết:
   ```sh
   npm install

## 4. Chạy ứng dụng

1. Chạy lệnh sau để khởi động ứng dụng:
   ```sh
   npm run dev
2. Mở trình duyệt và truy cập vào địa chỉ [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 5. Các lệnh hữu ích khác

- Chạy ứng dụng ở môi trường production:
  ```sh
  npm run build
  npm run preview
- Kiểm tra lỗi trong code:
  ```sh
    npm run lint

## 6. Cấu trúc thư mục

- `public`: Chứa các file tĩnh như ảnh, favicon, ...
- `src`: Chứa mã nguồn của ứng dụng.
    - `assets`: Chứa các file tĩnh như ảnh, font, ...
    - `components`: Chứa các component React.
    - `pages`: Chứa các trang của ứng dụng.
    - `axios`: Chứa câu hình kết nối với API.
    - `config`: Chứa các file cấu hình.
    - `constants`: Chứa các hằng số.
    - `mqtt`: Chứa các file cấu hình kết nối với MQTT.
    - `redux`: Chứa các file liên quan đến Redux.
    - `utils`: Chứa các hàm tiện ích.
    - `routes`: Chứa các file cấu hình định tuyến.
    - `servuce`: Chứa các file bao hàm
    - `translations`: Chứa các file ngôn ngữ.
    - `App.tsx`: Component gốc của ứng dụng.
    - `main.tsx`: File khởi tạo ứng dụng.
- `.env`: File cấu hình môi trường.
- `tsconfig.json`: File cấu hình TypeScript.
- `package.json`: File cấu hình npm.
- `README.md`: File hướng dẫn cài đặt.

## 7. Các công nghệ sử dụng

- [Vite](https://vitejs.dev/): Công cụ phát triển ứng dụng nhanh và hiệu quả.
- [Axios](https://axios-http.com/): Thư viện HTTP Client dùng để gửi các yêu cầu HTTP.
- [React](https://reactjs.org/): Thư viện JavaScript phổ biến dùng để xây dựng giao diện người dùng.
- [Redux Toolkit](https://redux-toolkit.js.org/): Thư viện Redux Toolkit giúp quản lý trạng thái ứng dụng.
- [React Router](https://reactrouter.com/): Thư viện React Router giúp điều hướng giữa các trang.
- [i18next](https://www.i18next.com/): Thư viện hỗ trợ đa ngôn ngữ.
- [MQTT.js](https://mqtt.org/): Thư viện MQTT giúp kết nối với MQTT Broker.
- [Ant Design](https://ant.design/): Thư viện UI giúp xây dựng giao diện người dùng nhanh chóng và đẹp mắt.
- [bootstrap](https://getbootstrap.com/): Thư viện CSS giúp xây dựng giao diện người dùng nhanh chóng và đẹp mắt.
- [React Query](https://react-query.tanstack.com/): Thư viện giúp quản lý dữ liệu từ API.


## 8. Các trang chính

- [Trang chủ](http://localhost:3000/)
- [Trang danh sách sản phẩm](http://localhost:3000/shop)
- [Trang chi tiết sản phẩm](http://localhost:3000/product/:id)
- [Trang giỏ hàng](http://localhost:3000/cart)
- [Trang thanh toán](http://localhost:3000/checkout)
- [Trang kiểm tra đơn hàng](http://localhost:3000/tracking-order)
- [Trang đăng nhập admin](http://localhost:3000/admin/login)
- [Trang admin](http://localhost:3000/admin)

## 9. Cấu trúc của website

- Sidebar: Chứa logo, Menu, Các thông tin liên hệ.
- Content: Chứa nội dung chính của trang.
- Footer: Chứa thông tin về website, liên hệ, ...
