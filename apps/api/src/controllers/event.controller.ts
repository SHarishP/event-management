import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "../custom";
import { PORT as port } from "../config/envConfig";

const prisma = new PrismaClient();
const PORT = Number(port) || 8000;

async function CreateEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      name,
      price,
      startDate,
      startTime,
      location,
      category,
      description,
      totalSeats,
    } = req.body;
    const { id: eoId } = req.user as User;
    const { name: eoName } = req.user as User;
    const { file } = req;

    // Konversi price ke integer
    const priceInt = parseInt(price, 10);
    if (isNaN(priceInt)) {
      throw new Error("Price must be a valid number!");
    }

    // Conversion totalSeats to Int
    const seatInt = parseInt(totalSeats, 10);
    if (isNaN(seatInt)) {
      throw new Error("Total Seats must be a valid number!");
    }

    // Validasi input
    if (!name) throw new Error("Name required!");
    if (!priceInt) throw new Error("Price required!");
    if (!seatInt) throw new Error("Seat is required");
    if (!startDate || !startTime)
      throw new Error("Start Date and Time required!");

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

    // If banner doesn't exist, use default banner
    const eventBanner = file?.filename ?? "EVT_default.jpg";

    // Test YOU NEED TO DELETE IT LATER
    console.log(eoName);
    console.log(`id: ${eoId}`);

    // Input event ke database
    await prisma.event.create({
      data: {
        name,
        createdById: eoId,
        price: priceInt,
        startDate,
        startTime,
        locationId: findLocation.id,
        categoryId: findCategory.id,
        description,
        banner: eventBanner,
        totalSeats: seatInt,
        remainSeats: seatInt,
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

async function GetCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await prisma.category.findMany({
      select: {
        name: true,
      },
    });
    res.status(200).send({
      message: "Success",
      categories,
    });
  } catch (err) {
    next(err);
  }
}

async function GetLocations(req: Request, res: Response, next: NextFunction) {
  try {
    const locations = await prisma.location.findMany({
      select: {
        name: true,
      },
    });
    res.status(200).send({
      message: "Success",
      locations,
    });
  } catch (err) {
    next(err);
  }
}

async function GetAllEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        createdBy: {
          select: {
            name: true,
          },
        },
        price: true,
        startDate: true,
        startTime: true,
        location: {
          select: {
            name: true,
          },
        },
        description: true,
        banner: true,
        totalSeats: true,
        remainSeats: true,
      },
    });
    const eventsWithBannerUrl = events.map((event) => ({
      ...event,
      bannerUrl: event.banner
        ? `http://localhost:${PORT}/public/banner/${event.banner}`
        : null,
    }));
    res.status(200).send({
      message: "Success",
      events: eventsWithBannerUrl,
    });
  } catch (err) {
    next(err);
  }
}

async function GetEventsByCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = req.query.category as string;
    const findCategory = await prisma.category.findFirst({
      where: { name: category },
    });
    if (!findCategory) throw new Error("Category not found");

    const events = await prisma.event.findMany({
      where: { categoryId: findCategory.id },
      select: {
        name: true,
        createdBy: {
          select: {
            name: true,
          },
        },
        price: true,
        startDate: true,
        startTime: true,
        location: {
          select: {
            name: true,
          },
        },
        description: true,
        banner: true,
      },
    });
    res.status(200).send({
      message: "Success",
      events,
    });
  } catch (err) {
    next(err);
  }
}

async function GetEventsByLoc(req: Request, res: Response, next: NextFunction) {
  try {
    const { location } = req.params;
    const findLocation = await prisma.category.findFirst({
      where: { name: location },
    });
    if (!findLocation) throw new Error("Category not found");

    const events = await prisma.event.findMany({
      where: { categoryId: findLocation.id },
      select: {
        name: true,
        createdBy: {
          select: {
            name: true,
          },
        },
        price: true,
        startDate: true,
        startTime: true,
        location: {
          select: {
            name: true,
          },
        },
        description: true,
        banner: true,
      },
    });
    res.status(200).send({
      message: "Success",
      events,
    });
  } catch (err) {
    next(err);
  }
}

async function GetEventsByFilter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { category, location } = req.query;
    const filters: any = {};

    if (category) {
      const findCategory = await prisma.category.findFirst({
        where: { name: category as string },
      });
      if (!findCategory) throw new Error("Category not found");
      filters.categoryId = findCategory.id;
    }
    if (location) {
      const findLocation = await prisma.location.findFirst({
        where: { name: location as string },
      });
      if (!findLocation) throw new Error("Location not found");
      filters.locationId = findLocation.id;
    }

    const events = await prisma.event.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        createdBy: {
          select: {
            name: true,
          },
        },
        price: true,
        startDate: true,
        startTime: true,
        location: {
          select: {
            name: true,
          },
        },
        description: true,
        banner: true,
        totalSeats: true,
        remainSeats: true,
      },
    });
    const eventsWithBannerUrl = events.map((event) => ({
      ...event,
      bannerUrl: event.banner
        ? `http://localhost:${PORT}/public/banner/${event.banner}`
        : null,
    }));
    res.status(200).send({
      message: "Success",
      events: eventsWithBannerUrl,
    });
  } catch (err) {
    next(err);
  }
}

async function GetEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const eventId = req.query.eventId as string;
    const parseId = parseInt(eventId);
    const findEvent = await prisma.event.findUnique({
      where: { id: parseId },
      select: {
        id: true,
        name: true,
        createdBy: {
          select: {
            name: true,
          },
        },
        price: true,
        startDate: true,
        startTime: true,
        location: {
          select: {
            name: true,
          },
        },
        description: true,
        banner: true,
        totalSeats: true,
        remainSeats: true,
      },
    });
    if (!findEvent) throw new Error("Event not found");
    const bannerUrl = `http://localhost:${PORT}/public/banner/${findEvent.banner}`;
    const eventWithBannerUrl = { ...findEvent, bannerUrl };
    res.status(200).send({
      message: "Success",
      event: eventWithBannerUrl,
    });
  } catch (err) {
    next(err);
  }
}

export {
  CreateEvent,
  GetMyEvents,
  GetCategories,
  GetLocations,
  GetAllEvents,
  GetEventsByCategory,
  GetEventsByLoc,
  GetEventsByFilter,
  GetEvent,
};
