import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "../custom";

const prisma = new PrismaClient();

async function CreateEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      name,
      price,
      startDate,
      startTime,
      location,
      category,
      availableSeat,
      description,
    } = req.body;
    const { id: eoId } = req.user as User;
    const { name: eoName } = req.user as User;

    // Validasi input
    if (!name) throw new Error("Name required!");
    if (!price) throw new Error("Price required!");
    if (!startDate || !startTime)
      throw new Error("Start Date and Time required!");
    if (!availableSeat) throw new Error("Available Seat required!");

    // Periksa apakah lokasi ada
    const findLocation = await prisma.location.findFirst({
      where: { name: location },
    });
    if (!findLocation) throw new Error("Location not found!");
    let locationId: number = findLocation.id;

    // Periksa apakah kategori ada
    const findCategory = await prisma.category.findFirst({
      where: { name: category },
    });
    if (!findCategory) throw new Error("Category not found!");
    let categoryId: number = findCategory.id;

    // Test YOU NEED TO DELETE IT LATER
    console.log(eoName);
    console.log(`id: ${eoId}`);

    // Input event ke database
    await prisma.event.create({
      data: {
        name,
        createdById: eoId,
        price,
        startDate,
        startTime,
        locationId: findLocation.id,
        categoryId: findCategory.id,
        description,
      },
    });

    res.status(200).send({
      message: "Event created!",
    });
  } catch (err) {
    console;
    next(err);
  }
}

async function GetMyEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: eoId } = req.user as User;

    const myEvents = await prisma.event.findMany({
      where: { createdById: eoId },
    });
    res.status(200).send({
      message: "This is your event(s)!",
      data: myEvents,
    });
  } catch (err) {
    next(err);
  }
}

export { CreateEvent, GetMyEvents };
