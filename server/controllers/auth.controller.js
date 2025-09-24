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
      message: "User registered successfully",
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
      { userId: user.id, role: user.role },
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
export { register, login };
