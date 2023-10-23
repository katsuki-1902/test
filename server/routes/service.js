const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "danhauloc@gmail.com",
    pass: "ijkntiyumoqauctj",
  },
});
router.get("/", async (req, res) => {
  try {
    res.json({ message: "Welcome to the API" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/send-mail", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/verify-mail", async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(email);
    const emailOption = {
      from: "danhauloc@gmail.com",
      to: email,
      subject: "Mã xác thực tài khoản",
      text:
        "Mã xác thực tài khoản của bạn là " +
        otp +
        ". Mã xác thực có hiệu lực trong 5 phút kể từ khi bạn nhận được email này. Nếu bạn không yêu cầu mã xác thực, vui lòng bỏ qua email này và không tiết lộ mã xác thực cho bất kỳ ai.",
    };
    transporter.sendMail(emailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        // do something useful
        res.json({ message: "Email sent" });
      }
    });
    res.json({ message: email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
