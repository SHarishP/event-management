import { number, object, string, mixed, array } from "yup";
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

const BookSchema = object({
  seats: number().required("Seat required!"),
  usePoints: number().min(0, "Points cannot be negative"),
});

const Transaction = object({
  transactionIds: array()
    .of(number()) // Pastikan array berisi number
    .min(1, "At least one transaction must be selected") // Pastikan setidaknya ada satu transaksi yang dipilih
    .required("Transaction selection is required!"),
  useCoupon: mixed()
    .oneOf([true, false], "UseCoupon must be either true or false")
    .required("Coupon selection is required"),
});

const Payment = object({
  paymentId: number().required("Payment Id Required!"),
  paymentProof: string().required("Payment Proof Required"),
});
export {
  RegisterSchema,
  LoginSchema,
  EventSchema,
  BookSchema,
  Transaction,
  Payment,
};
