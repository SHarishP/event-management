import { object, string } from "yup";
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

const Schema = object({
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

export default Schema;
