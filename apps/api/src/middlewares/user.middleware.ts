import { User } from "../custom";
import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../config/envConfig";
import { verify } from "jsonwebtoken";

// Make a function verify user by sending a token
async function VerifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const userToken = req.header("Authorization")?.replace("Bearer ", "");
    if (!userToken) throw new Error("Unauthorized");
    const verifyToken = verify(userToken, SECRET_KEY as string);
    if (!verifyToken) throw new Error("Unauthorized");
    req.user = verifyToken as User;
    next();
  } catch (err) {
    next(err);
  }
}

// Function to see if role is eo
async function EoGuard(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.role !== "eo") throw new Error("Not an EO!");
    console.log("Request User :", req.user);
    next();
  } catch (err) {
    next(err);
  }
}

export { VerifyToken, EoGuard };
