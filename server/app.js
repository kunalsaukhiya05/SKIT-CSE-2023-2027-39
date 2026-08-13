const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = process.env.PORT || 4000;
const DBConnection = require("./DB/DB.connection");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

// Route imports
const studentRoute = require("./routes/student.route");
const teacherRoute = require("./routes/teacher.route");
const classRouter = require("./routes/class.route");
const assignmentRouter = require("./routes/assignment.route");
const resourceRouter = require("./routes/resource.route");
const attendanceRouter = require("./routes/attendance.route");
const notificationRouter = require("./routes/notification.route");
const adminRouter = require("./routes/admin.route");
const aiRouter = require("./routes/ai.route");

// Database Connection
DBConnection();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// API Routes
app.use("/api/student", studentRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/class", classRouter);
app.use("/api/assignment", assignmentRouter);
app.use("/api/resource", resourceRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/ai", aiRouter);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Remote Classroom for Rural Colleges — API Server Running",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});