import 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      roles?: string[];
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: Express.User;
  }
}

export {};
