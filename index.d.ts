import { Request, Response, NextFunction } from 'express';

export function login(id: any, res: Response): Promise<boolean>;
export function logout(req: Request, res: Response): Promise<boolean>;
export function authenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
export function authenticated(req: Request, res: Response, next: NextFunction, user: any): void;
export function unauthenticated(req: Request, res: Response, next: NextFunction, clear?: boolean): void;
export function checkAuthenticated(req: Request, res: Response, next: NextFunction): void;
export function checkNotAuthenticated(req: Request, res: Response, next: NextFunction): void;
export function setup(opt: Opt): void;
export const config: Opt;

interface Opt {
    cookieName?: string,
    authUserIdField?: string,
    createAuth: (id: any, key: string) => PromiseLike<any>;
    checkAuth: (key: string) => PromiseLike<any>;
    deleteAuth: (key: string) => PromiseLike<any>;
    getUser: (id: any) => PromiseLike<any>;
    setCookie: (res: Response, key: string) => any;
    randomKey: () => Promise<string> | string;
    redirectAuthenticated?: string;
    redirectUnauthenticated?: string;
}