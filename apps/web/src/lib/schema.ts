import { number, object, string, mixed } from "yup";
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
const validationMessage: IValidationMessage = {
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

const RegisterSchema = object({
  name: string()
    .min(3, validationMessage.name.length)
    .max(30, validationMessage.name.length)
    .required(validationMessage.name.notEmpty),
  email: string()
    .email(validationMessage.email.isEmail)
    .required(validationMessage.email.notEmpty),
  password: string()
    .required(validationMessage.password.notEmpty)
    .matches(
      /^(?=.*[\d])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/,
      validationMessage.password.format
    ),
});

const LoginSchema = object({
  email: string()
    .email(validationMessage.email.isEmail)
    .required(validationMessage.email.notEmpty),
  password: string().required(validationMessage.password.notEmpty),
});

const maxSize = 2 * 1024 * 1024;
const EventSchema = object({
  name: string().required(validationMessage.name.notEmpty),
  price: number().required("Price required!"),
  startDate: string().required("Date of event required!"),
  startTime: string().required("Time of event required!"),
  location: string().required("Location required!"),
  category: string().required("Category required!"),
  description: string(),
  file: mixed().test("fileSize", "file exceed maxsize", (value: any) => {
    return value ? value.size <= maxSize : true;
  }),
  totalSeats: number().required("Seat required!"),
});

export { RegisterSchema, LoginSchema, EventSchema };
