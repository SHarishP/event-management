import { Request, Response, NextFunction } from "express";

async function CreateEvent(req: Request, res: Response, next: NextFunction) {
  try {
    // this is just test code to try VerifyEoToken, YOU NEED TO UPDATE IT LATER!
    const { event_name, event_location } = req.body;
    res.status(200).send({
      message: "Event created!",
      data: {
        event_name,
        event_location,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function GetMyEvents(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).send({
      message: "This is your event(s)!",
    });
  } catch (err) {
    next(err);
  }
}

export { CreateEvent, GetMyEvents };
