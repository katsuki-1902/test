"use client";

import AdminCategory from "@/components/admin/category";
import OrderList from "@/components/admin/order";
import AdminProduct from "@/components/admin/product";
import ProductList from "@/components/admin/productsList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Profile } from "../profile/page";

const AdminPage = () => {
  const pathName = usePathname();
  useEffect(() => {
    const profileString = localStorage.getItem("PROFILE");
    let profile: Profile | null = null;
    if (profileString) {
      profile = JSON.parse(profileString) as Profile;
    }
    if (profile?.role !== "ADMIN") {
      localStorage.removeItem("PROFILE");
      window.location.href = "/dang-nhap";
    } else {
    }
  }, [pathName]);

  const router = useRouter();
  const content = useSearchParams().get("content") || "category";
  return (
    <div className="admin">
      <h1>Quản lý trang web</h1>
      <div className="admin-menu">
        <button
          onClick={() => {
            router.push("/admin?content=category");
          }}
          className={content === "category" ? "active" : ""}
        >
          Danh mục
        </button>
        <button
          onClick={() => {
            router.push("/admin?content=products");
          }}
          className={content === "products" ? "active" : ""}
        >
          Sản phẩm
        </button>
        <button
          onClick={() => {
            router.push("/admin?content=orders");
          }}
          className={content === "orders" ? "active" : ""}
        >
          Đơn hàng
        </button>
        <button
          onClick={() => {
            router.push("/admin?content=new-product");
          }}
          className={content === "new-product" ? "active" : ""}
        >
          Thêm mới
        </button>
      </div>
      {content === "category" && <AdminCategory />}
      {content === "products" && <ProductList />}
      {content === "orders" && <OrderList />}
      {content === "new-product" && <AdminProduct />}
    </div>
  );
};

export default AdminPage;
