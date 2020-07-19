const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const path = require("path");

//connect to database
connectDB();
app.use(cors());
app.use(express.json({ extended: false }));
app.use("/unit", require("./routes/unit"));
app.use("/auth", require("./routes/user"));
app.use("/employee", require("./routes/employee"));

// const corsOptions = {
//   origin: "https://unitsmanagement.herokuapp.com",
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.options("*", cors());

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("App listening on port 5000!");
});
