import express from "express";
import {
  addBlog,
  deleteById,
  getAllBlogs,
  getById,
  updateBlog,
} from "../controller/blog-controller.js";
const blogRouter = express.Router();
blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", getById);
blogRouter.post("/add", addBlog);
blogRouter.put("/update/:id", updateBlog);
blogRouter.delete("/:id", deleteById);

export default blogRouter;
