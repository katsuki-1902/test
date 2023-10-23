import ProductItem from "@/components/productItem";
import { Product } from "@/model/product";
import { requestOptions } from "@/utils";
import { useState } from "react";

export default async function Home() {
  const products: Product[] = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products?limit=12`, {
    ...requestOptions,
    next: {
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return [];
    });

  const productCount: { count: number } = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products/count`, {
    next: {
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return { count: 0 };
    });
  return (
    <main className="main">
      <div className="banner">
        <img src="https://theme.hstatic.net/200000305259/1001044366/14/slide_index_2.jpg?v=30" alt="" />
      </div>
      <div className="term">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 32 32">
            <path d="M 0 6 L 0 8 L 19 8 L 19 23 L 12.84375 23 C 12.398438 21.28125 10.851563 20 9 20 C 7.148438 20 5.601563 21.28125 5.15625 23 L 4 23 L 4 18 L 2 18 L 2 25 L 5.15625 25 C 5.601563 26.71875 7.148438 28 9 28 C 10.851563 28 12.398438 26.71875 12.84375 25 L 21.15625 25 C 21.601563 26.71875 23.148438 28 25 28 C 26.851563 28 28.398438 26.71875 28.84375 25 L 32 25 L 32 16.84375 L 31.9375 16.6875 L 29.9375 10.6875 L 29.71875 10 L 21 10 L 21 6 Z M 1 10 L 1 12 L 10 12 L 10 10 Z M 21 12 L 28.28125 12 L 30 17.125 L 30 23 L 28.84375 23 C 28.398438 21.28125 26.851563 20 25 20 C 23.148438 20 21.601563 21.28125 21.15625 23 L 21 23 Z M 2 14 L 2 16 L 8 16 L 8 14 Z M 9 22 C 10.117188 22 11 22.882813 11 24 C 11 25.117188 10.117188 26 9 26 C 7.882813 26 7 25.117188 7 24 C 7 22.882813 7.882813 22 9 22 Z M 25 22 C 26.117188 22 27 22.882813 27 24 C 27 25.117188 26.117188 26 25 26 C 23.882813 26 23 25.117188 23 24 C 23 22.882813 23.882813 22 25 22 Z" />
          </svg>
          <strong>Giao hàng toàn quốc</strong>
          <p>
            Thời gian giao hàng linh động từ 3 - 4 - 5 ngày tùy khu vực, đôi khi sẽ nhanh hơn hoặc chậm hơn. Mong Quý
            Khách hàng thông cảm và cố gắng đợi hàng giúp shop.
          </p>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800px"
            height="800px"
            viewBox="0 0 1024 1024"
            className="icon"
            version="1.1"
          >
            <path
              d="M365.44 256.34h-57.05c57.54-45.47 128.96-71.11 203.27-71.11 160.55 0 296.58 114.66 323.45 272.64l72.1-12.25C874.34 252.36 707.99 112.1 511.66 112.1c-93.89 0-184.01 33.48-255.5 92.6v-56.23h-73.13v181.01h182.42v-73.14zM658.2 767.73h59.92c-58.07 47.06-130.82 73.7-206.47 73.7-160.66 0-296.69-114.75-323.49-272.87l-72.1 12.21c32.76 193.42 199.13 333.79 395.59 333.79 93.97 0 184.29-33.57 255.84-92.84v53.9h73.13V694.6H658.2v73.13z"
              fill="#0F1F3C"
            />
            <path
              d="M582.53 389.14l-70.4 70.39-70.38-70.39-38.78 38.78 50.42 50.42h-39.23v54.85h70.54v23.91h-68.34v54.85h68.34v65.92h54.85v-65.92h68.37V557.1h-68.37v-23.91h70.56v-54.85h-39.23l50.43-50.42z"
              fill="#0F1F3C"
            />
          </svg>
          <strong>CHÍNH SÁCH ĐỔI TRẢ HÀNG</strong>
          <p>
            Sản phẩm được phép đổi hàng trong vòng 36h nếu phát sinh lỗi từ nhà sản xuất (Yêu cầu: hình ảnh phần bị lỗi
            rõ nét, chi tiết và đầy đủ).
          </p>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800px"
            height="800px"
            viewBox="0 0 1024 1024"
            className="icon"
            version="1.1"
          >
            <path
              d="M865.01 599.07c-30.39-16.39-67.2-14.82-96.07 4.18l-194.73 128h-38.49c8.11-16.83 13.04-35.45 13.04-55.34v-54.59H292.57v-72.93H109.72v402.47h182.86v-36.57h339.9l238.79-153.77c26.95-17.36 43.04-46.84 43.04-78.88a93.778 93.778 0 0 0-49.3-82.57zM219.43 877.71h-36.57V621.53h36.57v256.18z m612.22-178.67l-220.68 142.1h-318.4V694.46h179.85c-7.64 21.39-28.12 36.75-52.11 36.75h-54.2v0.04h-0.71v73.14h230.7l213.02-140.04c9.34-6.11 17.89-2.64 21.18-0.91 3.27 1.77 10.86 7.07 10.86 18.2a20.652 20.652 0 0 1-9.51 17.4zM378.87 502.62c-20.45-35.7-31.25-76.48-31.25-117.91 0-131.07 106.6-237.71 237.66-237.71 131.04 0 237.64 106.64 237.64 237.71 0 41.46-10.8 82.25-31.27 117.95l63.46 36.36c26.79-46.75 40.95-100.11 40.95-154.3 0-171.41-139.41-310.86-310.79-310.86s-310.8 139.45-310.8 310.86c0 54.16 14.14 107.5 40.93 154.27l63.47-36.37z"
              fill="#0F1F3C"
            />
            <path
              d="M668.79 244.79l-83.51 83.53-83.54-83.53-38.79 38.78 64.67 64.66h-54.67v54.86h84.9v35.45h-82.38v54.85h82.38v79.59h54.85v-79.59h82.36v-54.85H612.7v-35.45h84.88v-54.86h-54.65l64.65-64.66z"
              fill="#0F1F3C"
            />
          </svg>
          <strong>GIAO HÀNG NHẬN TIỀN VÀ KIỂM KÊ ĐƠN HÀNG</strong>
          <p>
            Được phép kiểm hàng trước khi thanh toán. Lưu ý: Trường hợp Quý Khách hàng đã nhận hàng về nhà, vui lòng
            quay video unbox đơn hàng trong tình trạng nguyên vẹn để có căn cứ xác thực đơn hàng gặp phải vấn đề, trường
            hợp không có video shop không thể hỗ trợ.
          </p>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800px"
            height="800px"
            viewBox="0 0 1024 1024"
            className="icon"
            version="1.1"
          >
            <path
              d="M859.4 365.7c-8.9 0-17.5 1.3-25.7 3.7-32-148.2-164.1-259.7-321.7-259.7S222.2 221.2 190.3 369.4c-8.2-2.4-16.8-3.7-25.7-3.7-50.4 0-91.4 41-91.4 91.4v109.7c0 50.4 41 91.4 91.4 91.4s91.4-41 91.4-91.4V438.8c0-141.2 114.8-256 256-256s256 114.8 256 256v109.7c0 92.1-48.9 175.4-127.1 221-16.6-23.1-43.7-38.1-74.2-38.1H457c-50.4 0-91.4 41-91.4 91.4 0 50.4 41 91.4 91.4 91.4h109.7c42.9 0 79-29.8 88.8-69.7 81.6-39.6 141.8-109.7 169.2-193.1 10.7 4.4 22.4 6.8 34.7 6.8 50.4 0 91.4-41 91.4-91.4V457.1c0.1-50.4-41-91.4-91.4-91.4zM182.9 566.9c0 10.1-8.2 18.3-18.3 18.3s-18.3-8.2-18.3-18.3V457.1c0-10.1 8.2-18.3 18.3-18.3s18.3 8.2 18.3 18.3v109.8z m383.8 274.3H457c-10.1 0-18.3-8.2-18.3-18.3 0-10.1 8.2-18.3 18.3-18.3h109.7c10.1 0 18.3 8.2 18.3 18.3 0 10.1-8.2 18.3-18.3 18.3z m311-274.3c0 10.1-8.2 18.3-18.3 18.3s-18.3-8.2-18.3-18.3V457.2c0-10.1 8.2-18.3 18.3-18.3s18.3 8.2 18.3 18.3v109.7z"
              fill="#0F1F3C"
            />
            <path
              d="M512 658.3c80.7 0 146.3-65.6 146.3-146.3h-73.1c0 40.3-32.8 73.1-73.1 73.1S439 552.3 439 512h-73.1c-0.2 80.7 65.4 146.3 146.1 146.3z"
              fill="#0F1F3C"
            />
          </svg>
          <strong>ĐẶT HÀNG ONLINE VÀ KIỂM TRA ĐƠN HÀNG VUI LÒNG LIÊN HỆ</strong>
          <p>Hotline: {process.env.NEXT_PUBLIC_HOTLINE}</p>
        </div>
      </div>
      <div className="slogan">
        <div>
          <p>{process.env.NEXT_PUBLIC_BRAND_NAME}</p>
          <p>Chuyên Phân Phối Hàng Công Ty</p>
        </div>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
}
