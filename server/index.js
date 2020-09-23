const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const yup = require("yup");
const monk = require("monk");
const { nanoid } = require("nanoid");

require("dotenv").config();

const db = monk(process.env.MONGO_URI);
const urls = db.get("urls");
urls.createIndex("name");

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

app.post("/url", async (req, res, next) => {
  let { slug, url } = req.body;
  try {
    await schema.validate({
      slug,
      url,
    });
    if (!slug) {
      slug = nanoid(5);
    } else {
      const existing = await urls.findOne({ slug });
      if (existing) {
        throw new error("Slug in use.. cmon man");
      }
    }
    slug = slug.toLowerCase();
    const secret = nanoid(10).toLowerCase();
    const url = {
      slug,
      url,
      secret,
    };
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack:
      process.env.NODE_ENV === "production" ? "pancake stack" : error.stack,
  });
});

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
