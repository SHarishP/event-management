import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config/envConfig";

const prisma = new PrismaClient();

// Register EO to database
async function EoRegister(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    // Check if email already exist
    const findEo = await prisma.user.findUnique({
      where: { email },
    });
    if (findEo) throw new Error("Email already exist");

    // Register with fixed role is "eo"
    const findRoleEo = await prisma.role.findUnique({
      where: { name: "eo" },
    });
    if (!findRoleEo) throw new Error("Role doesn't exist!");

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    await prisma.$transaction(async (prisma) => {
      const newEo = await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          roleID: findRoleEo.id,
        },
      });

      res.status(200).send({
        message: "EO registration success",
        data: newEo,
      });
    });
  } catch (err) {
    next(err);
  }
}

// Get All EO Data
async function GetEoDatas(req: Request, res: Response, next: NextFunction) {
  try {
    const findRoleEo = await prisma.role.findUnique({
      where: { name: "eo" },
    });
    const eoDatas = await prisma.user.findMany({
      where: { roleID: findRoleEo?.id },
      select: {
        name: true,
        email: true,
      },
    });

    res.status(200).send({
      message: "Success",
      eoDatas,
    });
  } catch (err) {
    next(err);
  }
}

// Eo login function
async function EoLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    // Check if email exist in database
    const findEo = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    // If email doesn't exist throw new Error
    if (!findEo) throw new Error("Invalid email");

    // Compare password with salt and check if Password is valid
    const isValid = await compare(password, findEo.password);
    if (!isValid) throw new Error("Invalid password");

    // Use JWT
    const payload = {
      email,
      name: findEo.name,
      role: findEo.role.name,
    };
    const eoToken = sign(payload, SECRET_KEY as string, { expiresIn: "1d" });

    res.status(200).cookie("access_token", eoToken).send({
      message: "Login Success",
    });
  } catch (err) {
    next(err);
  }
}

export { EoRegister, GetEoDatas, EoLogin };
