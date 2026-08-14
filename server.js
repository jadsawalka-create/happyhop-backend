const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const kidsRoutes = require("./routes/kids");
app.use("/api/kids", kidsRoutes);

const venuesRoutes = require("./routes/venues");
app.use("/api/venues", venuesRoutes);

const bookingsRoutes = require("./routes/bookings");
app.use("/api/bookings", bookingsRoutes);

const roomsRoutes = require("./routes/rooms");
app.use("/api/rooms", roomsRoutes);

const staffRoutes = require("./routes/staff");
app.use("/api/staff", staffRoutes);

const settingsRoutes = require("./routes/settings");
app.use("/api/settings", settingsRoutes);
const scheduleRoutes = require("./routes/schedule");
app.use("/api/schedule", scheduleRoutes);
const requestsRoutes = require("./routes/requests");
app.use("/api/requests", requestsRoutes);
const packagesRoutes = require("./routes/packages");
app.use("/api/packages", packagesRoutes);
const sessionsRoutes = require("./routes/sessions");
app.use("/api/sessions", sessionsRoutes);
app.get("/", (req, res) => {
  res.json({ message: "HappyHop Platform API is running!", version: "1.0.0", status: "online" });
});

app.use("/api/sessions", sessionsRoutes);

const registriesRoutes = require('./routes/registries');
app.use('/api/registries', registriesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "HappyHop Platform API is running!", version: "1.0.0", status: "online" });
});

app.listen(PORT, () => {
  console.log("HappyHop server running on http://localhost:" + PORT);
});
const cafeRoutes = require('./routes/cafe');
   app.use('/api/cafe', cafeRoutes);
   