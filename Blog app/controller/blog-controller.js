import Blog from "../model/blog.js";
import User from "../model/User.js";
import mongoose from "mongoose";

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (err) {
    return console.log(err);
  }
  if (!blogs) {
    return res.status(404).json({ message: "No blogs Found!" });
  }
  return res.status(200).json({ blogs });
};
export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  const blog = new Blog({ title, description, image, user });
  let existinguser;
  try {
    existinguser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existinguser) {
    return res
      .status(400)
      .json({ message: "No existing user Found! Please register first" });
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existinguser.blogs.push(blog);
    await existinguser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ blog });
};
export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  let blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, { title, description });
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "No such blog found" });
  }
  return res.status(200).json({ blog });
};
export const getById = async (req, res, next) => {
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(blogId);
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return console.log("No blog With this id");
  }
  return res.status(200).json({ blog });
};
// export const deleteById = async (req, res, next) => {
//   const blogId = req.params.id;
//   let blog;
//   try {
//     blog = await Blog.findByIdAndDelete(blogId).populate("user");
//     await blog.user.blogs.pull(blog);
//     await blog.user.save();
//   } catch (err) {
//     return console
//       .log(err)
//       .json({ message: "Facing some issue read to resolve" });
//   }
//   if (!blog) {
//     return res.status(400).json({ message: "No blog found" });
//   }
//   return res.status(200).json({ message: "sucessfully deleted the blog" });
// };
export const deleteById = async (req, res, next) => {
  const blogId = req.params.id;

  try {
    // Attempt to find and delete the blog, while populating the user field
    const blog = await Blog.findByIdAndDelete(blogId).populate("user");

    // If blog is not found, return a 404 response
    if (!blog) {
      return res.status(404).json({ message: "No blog found" });
    }

    // Check if the user field is populated and exists
    if (blog.user) {
      // Remove the reference to the deleted blog from the user's blogs array
      blog.user.blogs.pull(blog._id); // Use blog._id instead of blog

      // Save the updated user document
      await blog.user.save();
    }

    // Return a success response
    return res.status(200).json({ message: "Successfully deleted the blog" });
  } catch (err) {
    // Log the error and send an appropriate response
    console.error(err); // Log the error to the console
    return res
      .status(500)
      .json({ message: "Facing some issue, ready to resolve" }); // Send a JSON response
  }
};
