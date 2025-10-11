import { prisma } from "../db.js"; // Prisma client
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator"; // needed for email validation

const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // 1. Validate inputs
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "Please provide firstname, lastname, email, and password",
      });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid email format" });
    }

    if (!validator.isLength(password, { min: 6 })) {
      return res.status(400).json({
        error: true,
        message: "Password must be at least 6 characters long",
      });
    }

    // 2. Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: true, message: "Email already in use" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const newUser = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: "USER", // default role
      },
    });

    // 5. Generate JWT
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6. Return response
    return res.status(201).json({
      message: "Success!",
      user: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
        token,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//LOGIN LOGIC
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    //Find User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials love" });
    }

    //compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    //Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // 5. Return token
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile (firstname, lastname, email)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // comes from authenticateToken middleware
    const { firstname, lastname, email } = req.body;

    if (!firstname || !lastname || !email) {
      return res
        .status(400)
        .json({ message: "Firstname, lastname, and email are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { firstname, lastname, email },
    });

    // ✅ Always send a JSON response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err.message);
    // ✅ Always respond with JSON, even on failure
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Change password (needs old + new password)
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new passwords are required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    if (!validator.isLength(newPassword, { min: 6 })) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // ✅ Always respond with JSON
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Error changing password:", err.message);
    // ✅ Always return JSON, never empty response
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export { register, login, me, updateProfile, changePassword };
