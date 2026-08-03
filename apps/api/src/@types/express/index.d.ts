// @types/express/index.d.ts
import 'express';

declare global {
  namespace Express {
    interface Request {
      user: { email: String; password: String; id?: number; name: String; role?:  String;};
      token?: String;  // Add token property to Request interface
      userTokenData?: any;
    }
  }
}   