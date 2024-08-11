import User from "../model/User.js";
import bcrypt from "bcryptjs";

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "no user found" });
  }
  return res.status(200).json({ users });
};
export default getAllUsers;

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existinguser;
  try {
    existinguser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (existinguser) {
    res.status(400).json({ message: "user already exist! login instead" });
  }
  const hashedpassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    password: hashedpassword,
    email,
    blogs: [],
  });
  try {
    await user.save();
  } catch (err) {
    return console.log(err);
  }
  return res.status(201).json({ user });
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existinguser;
  try {
    existinguser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existinguser) {
    return res.status(404).json({ message: "User not found! Register First" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existinguser.password);
  if (!isPasswordCorrect) {
    return res.status(400).josn({ message: "incorrect password!" });
  }
  if (isPasswordCorrect) {
    return res.status(200).json({ message: "sucessfull Login!" });
  }
};
