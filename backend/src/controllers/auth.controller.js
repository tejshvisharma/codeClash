import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exitingUser = await db.user.findUnique({
            where: {
                email
            }
        });
        if (exitingUser) {
            return res.status(400).json({
                error: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: UserRole.USER
            }
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
          expiresIn: "7d", 
        });

       res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
       });
      
       res.status(201).json({
        message: "User created successfully",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            image: newUser.image,
        }
       });
    } catch (err) {
        if(process.env.NODE_ENV === "development") console.log("error creating user: ", err);
        res.status(500).json({ message: "error creating user", err: err.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(401).json({
                error: "User does not exist"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                error: "Invalid credentials"
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "7d", 
        });

       res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
       });
      
       res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            }
        })
    } catch (err) {
        if(process.env.NODE_ENV === "development") console.log("error logging in user: ", err);
        res.status(500).json({ message: "error logging in user", err: err.message });
    }
}

export const logout = async (req, res) => {
    
}

export const me = async (req, res) => {
    
}
