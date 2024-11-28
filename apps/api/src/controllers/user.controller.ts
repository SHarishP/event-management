import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY, BASE_WEB_URL } from "../config/envConfig";
import { User } from "../custom";
import { PORT as port } from "../config/envConfig";
import { transporter } from "../lib/mail";
import path from "path";
import handlebars from "handlebars";
import fs from "fs";

const PORT = Number(port) || 8000;
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

    const templatePath = path.join(
      __dirname,
      "../templates",
      "register-mail.hbs"
    );
    const templateSource = await fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = handlebars.compile(templateSource);

    // Input cust data to database
    await prisma.$transaction(async (prisma) => {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          roleID: findRoleCust.id,
          avatar: "AVT_default.jpg",
        },
      });
    });

    // payload for verification
    const payload = {
      email,
    };
    const token = sign(payload, SECRET_KEY as string, { expiresIn: "1hr" });
    const verificationUrl = BASE_WEB_URL + `/verify/${token}`;
    const html = compiledTemplate({
      email: email,
      name: name,
      verificationUrl,
    });
    await transporter.sendMail({
      to: email,
      subject: "Welcome to our website",
      html,
    });

    res.status(200).send({
      message:
        "Customer registration success. Please check your email to verify your account!",
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

    // Convert plain password to hash
    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    const templatePath = path.join(
      __dirname,
      "../templates",
      "register-mail.hbs"
    );
    const templateSource = await fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = handlebars.compile(templateSource);

    await prisma.$transaction(async (prisma) => {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          roleID: findRoleEo.id,
          avatar: "AVT_default.jpg",
        },
      });
    });

    // payload for verification
    const payload = {
      email,
    };
    const token = sign(payload, SECRET_KEY as string, { expiresIn: "1hr" });
    const verificationUrl = BASE_WEB_URL + `/verify/${token}`;
    const html = compiledTemplate({
      email: email,
      name: name,
      verificationUrl,
    });
    await transporter.sendMail({
      to: email,
      subject: "Welcome to our website",
      html,
    });

    res.status(200).send({
      message:
        "EO registration success. Please check your email to verify your account!",
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
        avatar: true,
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
async function UserLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Check if email exist in database
    const findUser = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
    // If email doesn't exist throw new Error
    if (!findUser) throw new Error("Invalid email!");

    if (!findUser.isVerified)
      throw new Error("Please verify your account first");

    // Compare password with salt and check if password is valid
    const isValid = await compare(password, findUser.password);
    if (!isValid) throw new Error("Invalid password!");

    // Use JWT
    const payload = {
      email,
      name: findUser.name,
      role: findUser.role.name,
      avatar: findUser.avatar,
    };
    const custToken = sign(payload, SECRET_KEY as string, { expiresIn: "1d" });

    res.status(200).cookie("access_token", custToken).send({
      message: "Login Success",
    });
  } catch (err) {
    next(err);
  }
}

async function UpdateAvatar(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.user as User;
    const { file } = req;
    if (!file) {
      throw new Error("No file uploaded");
    }
    await prisma.user.update({
      where: { email },
      data: { avatar: file?.filename },
    });
    res.status(200).send({
      message: "Avatar updated successfully!",
    });
  } catch (err) {
    next(err);
  }
}

async function GetAvatar(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.query.email as string;
    const findAvatar = await prisma.user.findUnique({
      where: { email },
      select: {
        avatar: true,
      },
    });
    const avatarPath = `http://localhost:${PORT}/public/avatar/${findAvatar?.avatar}`;
    res.status(200).json(avatarPath);
  } catch (err) {
    next(err);
  }
}

async function VerifyUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.user as User;

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
      },
    });
    res.status(200).send({
      message: "Verify Success",
    });
  } catch (err) {
    next(err);
  }
}

export {
  CustRegist,
  EoRegist,
  GetCustDatas,
  GetEoDatas,
  UserLogin,
  UpdateAvatar,
  GetAvatar,
  VerifyUser,
};