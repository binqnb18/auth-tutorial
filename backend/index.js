import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config(); // Load biến môi trường từ .env

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Middleware để parse JSON trong body của các request
app.use(express.json());
app.use(cookieParser());

// Kết nối đến cơ sở dữ liệu
(async () => {
  try {
    await connectDB(); // Hàm connectDB được thực hiện
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
  }
})();

// Routes
app.use("/api/auth", authRoutes);

// Middleware bắt lỗi các route không tồn tại
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Middleware xử lý lỗi tổng quát
app.use((err, req, res, next) => {
  console.error("❌ An unexpected error occurred:", err.message);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred.",
    error: err.message,
  });
});

// Khởi động server
app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1); // Thoát nếu không thể khởi động server
  }
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
