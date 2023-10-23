"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUp = () => {
  const router = useRouter();
  const [signUpInfo, setSignUpInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState<number | null>(null);
  const handleSignUp = async () => {
    if (!signUpInfo.firstName || !signUpInfo.lastName || !signUpInfo.email || !signUpInfo.password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const newOtp = Math.floor(Math.random() * 1000000);
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/verify-mail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signUpInfo.email,
        otp: newOtp,
      }),
    }).then((res) => {
      setOtp(newOtp);
    });
  };
  const [otpInput, setOtpInput] = useState("");

  const handleVerify = async () => {
    if (Number(otpInput) === otp) {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpInfo),
      })
        .then((res) => {
          alert("Đăng ký thành công");
          router.push("/dang-nhap");
        })
        .catch((err) => {
          console.error(err);
          alert("Đăng ký thất bại");
        });
    }
  };

  return (
    <div className="account-container">
      {otp ? (
        <div className="account-box">
          <strong>Xác thực email</strong>
          <input
            type="text"
            placeholder="Nhập mã OTP"
            onChange={(e) => {
              setOtpInput(e.target.value);
            }}
            value={otpInput}
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
                handleVerify();
              }}
            >
              Đăng ký
            </button>
          </div>
          <div></div>
        </div>
      ) : (
        <div className="account-box">
          <strong>Đăng ký</strong>
          <input
            type="text"
            placeholder="Họ"
            onChange={(e) => {
              setSignUpInfo({ ...signUpInfo, firstName: e.target.value });
            }}
            value={signUpInfo.firstName}
          />
          <input
            type="text"
            placeholder="Tên"
            onChange={(e) => {
              setSignUpInfo({ ...signUpInfo, lastName: e.target.value });
            }}
            value={signUpInfo.lastName}
          />
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => {
              setSignUpInfo({ ...signUpInfo, email: e.target.value });
            }}
            value={signUpInfo.email}
          />
          <input
            type="text"
            placeholder="Mật khẩu"
            onChange={(e) => {
              setSignUpInfo({ ...signUpInfo, password: e.target.value });
            }}
            value={signUpInfo.password}
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
                handleSignUp();
              }}
            >
              
            </button>
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
