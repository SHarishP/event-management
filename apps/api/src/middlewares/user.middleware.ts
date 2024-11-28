import { User } from "../custom";
import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../config/envConfig";
import { verify } from "jsonwebtoken";

// Make a function verify user by sending a token
async function VerifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const eoToken = req.header("Authorization")?.replace("Bearer ", "");
    if (!eoToken) throw new Error("Unauthorized");
    const verifyEo = verify(eoToken, SECRET_KEY as string);
    if (!verifyEo) throw new Error("Unauthorized");
    req.user = verifyEo as User;
    next();
  } catch (err) {
    next(err);
  }
}

export { VerifyToken };
