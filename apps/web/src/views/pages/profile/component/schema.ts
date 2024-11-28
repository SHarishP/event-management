import { object, mixed } from "yup";

const maxSize = 1 * 2048 * 2048;

const Schema = object({
  avatar: mixed()
    .required("File cannot be empty")
    .test(
      "fileSize",
      "file exceed maxsize",
      (value: any) => value.size <= maxSize
    ),
});

export default Schema;
