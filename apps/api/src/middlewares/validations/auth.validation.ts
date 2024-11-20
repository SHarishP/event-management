import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { PassThrough } from "stream";

interface IValidationMessage {
  name: {
    notEmpty: string;
    length: string;
  };
  email: {
    notEmpty: string;
    isEmail: string;
  };
  password: {
    notEmpty: string;
    format: string;
  };
}
const ValidationMessage: IValidationMessage = {
  name: {
    notEmpty: "Name required!",
    length: "Name must be 3 characters minimum and 30 characters maximum!",
  },
  email: {
    notEmpty: "Email required!",
    isEmail: "Invalid email format!",
  },
  password: {
    notEmpty: "Password required!",
    format:
      "Password need to have atleast 6 characters with 1 Uppercase and 1 Special character",
  },
};

// Register Validation
const RegisterValidation = [
  body("name")
    .notEmpty()
    .withMessage(ValidationMessage.name.notEmpty)
    .isLength({ min: 3, max: 30 })
    .withMessage(ValidationMessage.name.length),
  body("email")
    .notEmpty()
    .withMessage(ValidationMessage.email.notEmpty)
    .isEmail()
    .withMessage(ValidationMessage.email.isEmail),
  body("password")
    .notEmpty()
    .withMessage(ValidationMessage.password.notEmpty)
    .matches(/^(?=.*[\d])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/)
    .withMessage(ValidationMessage.password.format),

  // Handler to validate
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new Error(errors.array()[0].msg);
      next();
    } catch (err) {
      next(err);
    }
  },
];

// Login Validation
const LoginValidation = [
  body("email")
    .notEmpty()
    .withMessage(ValidationMessage.email.notEmpty)
    .isEmail()
    .withMessage(ValidationMessage.email.isEmail),

  body("password").notEmpty().withMessage(ValidationMessage.password.notEmpty),

  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new Error(errors.array()[0].msg);
      next();
    } catch (err) {
      next(err);
    }
  },
];

export { RegisterValidation, LoginValidation };