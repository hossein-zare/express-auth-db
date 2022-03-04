import { Request, Response, NextFunction } from 'express';

export function login(id: any, res: Response): Promise<boolean>;
export function authenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
export function checkAuthenticated(req: Request, res: Response, next: NextFunction): void;
export function checkNotAuthenticated(req: Request, res: Response, next: NextFunction): void;
export function setup(opt: Opt): void;

interface Opt {
    createAuth: (id: any, key: string) => PromiseLike<any>;
    checkAuth: (key: string) => PromiseLike<any>;
    getUser: (id: any) => PromiseLike<any>;
    setCookie: (res: Response, key: string) => any;
    randomKey: () => Promise<string> | string;
    redirectAuthenticated: string;
    redirectUnauthenticated: string;
}