declare module 'jsonwebtoken';

declare namespace Express {
    interface Request {
        userName: {role, name};
    }
}