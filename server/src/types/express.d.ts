import { IUser } from './user.type';

declare module 'express-serve-static-core' {
  interface Request {
    identity?: IUser;
  }
}