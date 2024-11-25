import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config/envConfig";

const prisma = new PrismaClient();

// Register customer to database
async function CustRegist(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    // Check if email already exist
    const findCust = await prisma.user.findUnique({
      where: { email },
    });
    if (findCust) throw new Error("Email already exist");

    // Register with fixed role is "cust"
    const findRoleCust = await prisma.role.findUnique({
      where: { name: "cust" },
    });
    if (!findRoleCust) throw new Error("Role doesn't exist!");

    // Convert plain password to hash
    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    // Input cust data to database
    await prisma.$transaction(async (prisma) => {
      const newCust = await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          roleID: findRoleCust.id,
        },
      });
      res.status(200).send({
        message: "Customer registration success",
        data: newCust,
      });
    });
  } catch (err) {
    next(err);
  }
}

// Register eo to database
async function EoRegist(req: Request, res: Response, next: NextFunction) {
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

// Get All Cust Data
async function GetCustDatas(req: Request, res: Response, next: NextFunction) {
  try {
    const findRoleCust = await prisma.role.findUnique({
      where: { name: "cust" },
    });
    const custDatas = await prisma.user.findMany({
      where: { roleID: findRoleCust?.id },
      select: {
        name: true,
        email: true,
      },
    });
    res.status(200).send({
      message: "Success",
      custDatas,
    });
  } catch (err) {
    next(err);
  }
}

// Get All Eo Data
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

// Cust Login function
async function CustLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Check if email exist in database
    const findCust = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
    // If email doesn't exist throw new Error
    if (!findCust) throw new Error("Invalid email!");

    // Compare password with salt and check if password is valid
    const isValid = await compare(password, findCust.password);
    if (!isValid) throw new Error("Invalid password!");

    // Use JWT
    const payload = {
      email,
      name: findCust.name,
      role: findCust.role.name,
    };
    const custToken = sign(payload, SECRET_KEY as string, { expiresIn: "1d" });

    res.status(200).cookie("access_token", custToken).send({
      message: "Login Success",
    });
  } catch (err) {
    next(err);
  }
}

export { CustRegist, EoRegist, GetCustDatas, GetEoDatas, CustLogin };
