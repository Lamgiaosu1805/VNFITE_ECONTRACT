const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  db: 0,
});

redis.on("connect", () => console.log("🔗 Kết nối Redis thành công!"));
redis.on("error", (err) => console.error("❌ Lỗi Redis:", err));

module.exports = redis;