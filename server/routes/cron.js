const cron = require("cron");
const https = require("https");
const backendUrl = "https://ecom-server-po2d.onrender.com";

const job = new cron.CronJob("*/14 * * * *", function () {
  console.log("Cron job started");
  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Pinged server successfully");
      } else {
        console.log("Failed to ping server");
      }
    })
    .on("error", (err) => {
      console.log("Error pinging server");
    });
});

module.exports = job;
