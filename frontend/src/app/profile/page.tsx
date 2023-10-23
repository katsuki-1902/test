"use client";

import CartItem from "@/components/cartItem";
import { Order } from "@/model/category";
import { formatNumberWithCommas } from "@/utils/formatMoney";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { uuid } from "uuidv4";

export interface Profile {
  createdAt: string;
  email: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  password: string;
  address: string;
  phone: string;
  role: string;
  updatedAt: string;
  _id: string;
}

const defaultProfile = {
  createdAt: "",
  email: "",
  firstName: "",
  isActive: false,
  lastName: "",
  password: "",
  address: "",
  phone: "",
  role: "",
  updatedAt: "",
  _id: "",
};

const Profile = () => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [curProfile, setCurProfile] = useState<Profile>(defaultProfile);
  const pathName = usePathname();
  useEffect(() => {
    const profile = localStorage.getItem("PROFILE");
    if (profile) {
      setProfile({
        ...defaultProfile,
        ...JSON.parse(profile),
      });
      setCurProfile({
        ...defaultProfile,
        ...JSON.parse(profile),
      });
    } else {
      window.location.href = "/dang-nhap";
    }
  }, [pathName]);

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const getOrders = async () => {
      if (profile._id === "") {
        return;
      }
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/orders/${profile._id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res?.message) {
            alert("Lấy đơn hàng thất bại");
            return;
          }
          setOrders(res);
        })
        .catch((err) => {
          console.error(err);
          alert("Lấy đơn hàng thất bại");
        });
    };
    getOrders();
  }, [profile]);

  return (
    <div className="profile">
      {profile?.role === "USER" && (
        <div className="order-content">
          <h2>Danh sách đơn hàng</h2>
          {orders.map((order) => (
            <div className="order" key={order._id}>
              <div className="order-items">
                {order.products.map((product) =>
                  product.product ? (
                    <div className="order-item" key={product.product._id}>
                      <img src={product.product.image.split(",")[0]} alt="" />
                      <div>
                        <h3>{product.product.name}</h3>
                        {product.classify && JSON.parse(product.classify).length > 0 && (
                          <p>
                            Phân loại:{" "}
                            {JSON.parse(product.classify)
                              .map((item: { name: string; value: string }) => item.name + " " + item.value)
                              .join(", ")}
                          </p>
                        )}
                        <p>
                          {formatNumberWithCommas(product.product.price)}đ x {product.quantity}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p key={uuid()}>Sản phẩm này đã ngừng kinh doanh</p>
                  )
                )}
              </div>
              <p className="price">Tổng tiền: {formatNumberWithCommas(order.total)} đ</p>
            </div>
          ))}
        </div>
      )}
      <div className="profile-info">
        <h2>Thông tin cá nhân</h2>
        <table className="profile-content">
          <tbody>
            <tr>
              <td>Họ</td>
              <td>
                <input
                  type="text"
                  value={profile?.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <td>Tên</td>
              <td>
                <input
                  type="text"
                  value={profile?.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <td>Email</td>
              <td>
                <input
                  type="text"
                  value={profile?.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <td>Số điện thoại</td>
              <td>
                <input
                  type="text"
                  value={profile?.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <td>Địa chỉ</td>
              <td>
                <input
                  type="text"
                  value={profile?.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="btn-group">
          <button
            onClick={() => {
              localStorage.removeItem("PROFILE");
              window.location.href = "/dang-nhap";
            }}
          >
            Đăng xuất
          </button>
          {profile?.role === "ADMIN" ? (
            <button
              className="primary"
              onClick={() => {
                window.location.href = "/admin";
              }}
            >
              Tới trang quản lý
            </button>
          ) : (
            Object.keys(profile).some(
              (key: string) =>
                (profile as unknown as Record<string, unknown>)[key as keyof typeof profile] !==
                (curProfile as unknown as Record<string, unknown>)[key as keyof typeof curProfile]
            ) && (
              <button
                className="primary"
                onClick={() => {
                  fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/users/${profile._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(profile),
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      if (res.message) {
                        alert("Cập nhật thất bại");
                        return;
                      }
                      localStorage.setItem("PROFILE", JSON.stringify(profile));
                      alert("Cập nhật thành công");
                      window.location.reload();
                    })
                    .catch((err) => {
                      console.error(err);
                      alert("Cập nhật thất bại");
                    });
                }}
              >
                Cập nhật
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
