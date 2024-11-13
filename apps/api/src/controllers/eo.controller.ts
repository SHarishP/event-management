import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Register EO to database
async function EoRegister(req: Request, res: Response, next: NextFunction) {
  try {
    const { eo_name, eo_email, eo_password } = req.body;

    // Check if email already exist
    const findEo = await prisma.eo_data.findUnique({
      where: { eo_email },
    });
    if (findEo) throw new Error("Email already exist");

    await prisma.$transaction(async (prisma) => {
      const newEo = await prisma.eo_data.create({
        data: {
          eo_name,
          eo_email,
          eo_password,
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
    const eoDatas = await prisma.eo_data.findMany({
      select: {
        eo_email: true,
        eo_name: true,
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

export { EoRegister, GetEoDatas };
