import { EoUser } from "../custom";
import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../config/envConfig";
import { verify } from "jsonwebtoken";

// Make a function verify Eo by sending a token. This token is use to Create Event, Get Events, and Update Events
async function VerifyEoToken(req: Request, res: Response, next: NextFunction) {
  try {
    const eoToken = req.header("Authorization")?.replace("Bearer ", "");
    if (!eoToken) throw new Error("Unauthorized");
    const verifyEo = verify(eoToken, SECRET_KEY as string);
    if (!verifyEo) throw new Error("Unauthorized");
    req.eoUser = verifyEo as EoUser;
    next();
  } catch (err) {
    next(err);
  }
}

export { VerifyEoToken };
