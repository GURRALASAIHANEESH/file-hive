require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const folderRoutes = require("./routes/folders");
const imageRoutes = require("./routes/images");
const mcpRoutes = require("./routes/mcp");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/mcp", mcpRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});