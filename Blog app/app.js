import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-router.js";
import blogRouter from "./routes/blog-router.js";

const app = express();

app.use(express.json());
app.use("/api/user", router);
app.use("/api/blog", blogRouter);

mongoose
  .connect(
    "mongodb+srv://alimansoor419:dSHoKHiFz5G8w1qk@cluster0.l485e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(app.listen(3030))
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => console.log(err));
