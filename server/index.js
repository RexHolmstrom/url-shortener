const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "cdg.sh - Short URL",
  });
});

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
