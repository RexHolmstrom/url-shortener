const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const yup = require("yup");

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

//app.get("/url/:id", (req, res) => {});

//app.get("/:id", (req, res) => {});

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

app.post("/url", (req, res) => {});

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
