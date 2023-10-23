"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Login = () => {
  useEffect(() => {
    const profile = localStorage.getItem("PROFILE");
    if (profile) {
      router.back();
    }
  }, []);

  const router = useRouter();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const loginAction = async () => {
    if (!login.email || !login.password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          alert("Đăng nhập thất bại, sai email hoặc mật khẩu");
          return;
        }
        localStorage.setItem("PROFILE", JSON.stringify(res));
        alert("Đăng nhập thành công");
        if (res.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Đăng nhập thất bại");
      });
  };

  return (
    <div className="account-container">
      <div className="account-box">
        <strong>Đăng nhập</strong>
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
          value={login.email}
        />
        <input
          type="text"
          placeholder="Mật khẩu"
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
          value={login.password}
        />
        <div>
          <button
            onClick={() => {
              router.back();
            }}
          >
            Quay lại
          </button>
          <button
            onClick={() => {
              loginAction();
            }}
          >
            Đăng nhập
          </button>
        </div>
        <div>
          <a href="">Quên mật khẩu?</a> hoặc <a href="/dang-ky">Đăng ký</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
