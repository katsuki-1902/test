"use client";

import CartItem from "@/components/cartItem";
import { Cart } from "@/model/product";
import { formatNumberWithCommas } from "@/utils/formatMoney";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Profile } from "../profile/page";

const Cart = () => {
  const [profile, setProfile] = useState<Profile>({
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
  });
  const [cart, setCart] = useState<Cart[]>([]);
  const pathName = usePathname();
  const [change, setChange] = useState(false);
  const [note, setNote] = useState("");
  useEffect(() => {
    const profile = localStorage.getItem("PROFILE");
    if (profile) {
      setProfile(JSON.parse(profile));
    }
  }, [pathName]);

  useEffect(() => {
    const getCart = async () => {
      if (profile._id === "" || !profile._id) {
        const localCart = localStorage.getItem("CART");
        if (!localCart) return;
        const parsedCart = JSON.parse(localCart) as unknown as Cart[];
        if (parsedCart) {
          setCart(parsedCart);
        }
        return;
      }
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/cart/${profile._id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res?.message) {
            alert("Lấy giỏ hàng thất bại");
            return;
          }
          setCart(res.products);
        })
        .catch((err) => {
          console.error(err);
          alert("Lấy giỏ hàng thất bại");
        });
    };
    getCart();
  }, [profile, change]);

  const updateProfile = async () => {
    if (profile._id === "") {
      alert("Vui lòng đăng nhập để cập nhật thông tin");
      return;
    }
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
      })
      .catch((err) => {
        console.error(err);
        alert("Cập nhật thất bại");
      });
  };

  const purchase = async () => {
    if (!profile._id) {
      if (!profile.address || !profile.phone || !profile.firstName || !profile.lastName) {
        alert("Vui lòng điền đầy đủ thông tin cá nhân");
        return;
      }

      const cart = localStorage.getItem("CART");
      if (!cart) return;
      const parsedCart = JSON.parse(cart) as unknown as Cart[];
      fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/checkout-anonymous`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note,
          products: parsedCart,
          name: `${profile.firstName} ${profile.lastName}`,
          total: parsedCart.reduce((total, item) => total + item.product.price * item.quantity, 0),
          phone: profile.phone,
          address: profile.address,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message) {
            alert("Thanh toán thất bại");
            return;
          }
          alert("Thanh toán thành công");
          setCart([]);
          localStorage.removeItem("CART");
        })
        .catch((err) => {
          console.error(err);
          alert("Thanh toán thất bại");
        });

      return;
    }
    if (!profile.address || !profile.phone || !profile.firstName || !profile.lastName) {
      alert("Vui lòng điền đầy đủ thông tin cá nhân");
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/checkout/${profile._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          alert("Thanh toán thất bại");
          return;
        }
        alert("Thanh toán thành công");
        setCart([]);
      })
      .catch((err) => {
        console.error(err);
        alert("Thanh toán thất bại");
      });
  };
  return (
    <div>
      {cart.length === 0 ? (
        <div className="cart-empty">
          <h1>Giỏ hàng trống</h1>
          <a href="/">Tiếp tục mua hàng</a>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <h1>Giỏ hàng</h1>

            {cart.map(
              (item) =>
                item.product && (
                  <CartItem
                    key={item.product._id}
                    cart={item}
                    onChange={() => {
                      setChange(!change);
                    }}
                  />
                )
            )}
            <textarea
              placeholder="Ghi chú"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
              }}
            ></textarea>
          </div>
          <div className="cart-total">
            <div className="profile-content">
              <table>
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
            </div>
            <strong>
              Tổng đơn hàng:{" "}
              {formatNumberWithCommas(cart.reduce((total, item) => total + item.product.price * item.quantity, 0))}đ
            </strong>

            <button
              onClick={() => {
                if (!profile._id) {
                  purchase();
                  return;
                }
                updateProfile().then(() => {
                  purchase();
                });
              }}
            >
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
