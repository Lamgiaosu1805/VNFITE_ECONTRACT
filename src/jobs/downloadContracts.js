const cron = require("node-cron");
const { processHopDongChuaTai } = require("../services/contract");

module.exports = () => {
    cron.schedule("58 23 * * *", async () => {
        const now = new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour12: false,
        });
        console.log(`🕒 [${now}] Running download contract job...`);
        try {
          const result = await processHopDongChuaTai();
          console.log("✅ Job result:", result);
        } catch (err) {
          console.error("❌ Contract job failed:", err.message);
        }
    });
}