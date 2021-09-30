const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/users");
const jobRouter = require("./routers/jobs");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(jobRouter);

app.listen(port, () => {
  console.log("Server connected on port:", port);
});
