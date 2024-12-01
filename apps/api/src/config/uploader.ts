import { Request } from "express";
import multer from "multer";
import { join } from "path";
import { readdirSync } from "fs";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const SingleUploader = (filePrefix: string, folderName?: string) => {
  const maxSize = 1 * 2048 * 2048;
  const defaultDir = join(__dirname, "../../public");

  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback
    ) => {
      const destination = folderName ? defaultDir + folderName : defaultDir;
      cb(null, destination);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) => {
      try {
        const destination = folderName
          ? join(defaultDir, folderName)
          : defaultDir;

        // Membaca jumlah file di folder tujuan
        const files = readdirSync(destination);
        const numberedFiles = files.filter((file) =>
          file.startsWith(filePrefix)
        );

        // Menentukan nomor urut berikutnya
        const nextIndex = numberedFiles.length + 1;
        const paddedIndex = String(nextIndex).padStart(4, "0");

        const originalNameParts = file.originalname.split(".");
        const fileExtension = originalNameParts[originalNameParts.length - 1];

        const newFileName = `${filePrefix}_${paddedIndex}.${fileExtension}`;
        cb(null, newFileName);
      } catch (err) {
        cb(err as Error, "");
      }
    },
  });

  return multer({ storage: storage, limits: { fileSize: maxSize } }).single(
    "file"
  );
};
