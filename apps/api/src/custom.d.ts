export type EoUser = {
  email: string;
  name: string;
  role: string;
};

declare global {
  namespace Express {
    export interface Request {
      eoUser?: EoUser;
    }
  }
}
