"use client";
import { Profile } from "@/app/profile/page";
import { Product } from "@/model/product";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ClassifyProps } from "./admin/addItem";

const AddToCart = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [classify, setClassify] = useState<
    {
      name: string;
      value: string;
    }[]
  >([]);

  const pathName = usePathname();
  useEffect(() => {
    const profile = localStorage.getItem("PROFILE");
    if (profile) {
      setProfile(JSON.parse(profile));
    }
  }, [pathName]);

  const addToCart = async () => {
    if (product.classify) {
      const productClassify = JSON.parse(product.classify);

      if (!Array.isArray(productClassify)) {
        alert("Thêm vào giỏ hàng thất bại");
        return;
      }
      if (productClassify.length !== classify.length) {
        alert("Vui lòng chọn đầy đủ phân loại");
        return;
      }
    }
    const newItem = {
      product: product,
      quantity,
      classify: JSON.stringify(classify),
    };
    if (!profile) {
      const cart = localStorage.getItem("CART");
      if (!cart) {
        localStorage.setItem("CART", JSON.stringify([newItem]));
        alert("Thêm vào giỏ hàng thành công");
        return;
      }
      const newCart = JSON.parse(cart);
      const index = newCart.findIndex((c: any) => c.product._id === product._id);
      if (index !== -1) {
        newCart[index].quantity += quantity;
        localStorage.setItem("CART", JSON.stringify(newCart));
        alert("Thêm vào giỏ hàng thành công");
        return;
      }
      newCart.push(newItem);
      localStorage.setItem("CART", JSON.stringify(newCart));
      alert("Thêm vào giỏ hàng thành công");
      return;
    }

    await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/add-to-cart/${profile._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        product: product,
        quantity,
        classify: JSON.stringify(classify),
        addMore: true,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          alert("Thêm vào giỏ hàng thất bại");
          return;
        }
        alert("Thêm vào giỏ hàng thành công");
      })
      .catch((err) => {
        console.error(err);
        alert("Thêm vào giỏ hàng thất bại");
      });
  };

  return (
    <div>
      <div className="button-box">
        <div>
          <button
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => {
              setQuantity(quantity + 1);
            }}
          >
            +
          </button>
        </div>
      </div>
      {product.classify && Array.isArray(JSON.parse(product.classify)) && (
        <div className="classify">
          <strong>Phân loại </strong>
          <div>
            {JSON.parse(product.classify)?.map((cls: { name: string; child: { name: string }[] }) => (
              <div className="classify-item" key={cls.name}>
                <label>{cls.name}</label>
                <div>
                  {cls.child.map((child: { name: string }) => (
                    <button
                      key={child.name}
                      className={classify.find((c) => c.name === cls.name)?.value === child.name ? "selected" : ""}
                      onClick={() => {
                        const newClassify = [...classify];
                        const index = newClassify.findIndex((c) => c.name === cls.name);
                        if (index !== -1) {
                          newClassify[index].value = child.name;
                          setClassify(newClassify);
                          return;
                        }
                        newClassify.push({ name: cls.name, value: child.name });
                        setClassify(newClassify);
                      }}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="cart">
        <button
          onClick={() => {
            addToCart();
          }}
        >
          Thêm vào giỏ hàng
        </button>
        <button
          onClick={() => {
            addToCart().then(() => {
              window.location.href = "/gio-hang";
            });
          }}
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
