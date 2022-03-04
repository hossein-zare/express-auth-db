const config = {
    cookieName: 'key',
    createAuth: null,
    checkAuth: null,
    getUser: null,
    setCookie: null,
    randomKey: null,
    redirectAuthenticated: '/',
    redirectUnauthenticated: '/',
};

export function setup(opt) {
    Object.assign(config, opt);
}

export async function login(id, res) {
    const key = await config.randomKey();

    await config.createAuth(id, key);

    config.setCookie(res, key);

    return true;
}

export async function authenticate(req, res, next) {
    if (req.cookies?.[config.cookieName]) {
        const auth = await config.checkAuth(req.cookies[config.cookieName])

        if (auth) {
            const user = await config.getUser(auth?.user_id);

            if (user) {
                return authenticated(req, next, user);
            }
        }

        return unauthenticated(req, res, next);
    }
    
    return unauthenticated(req, res, next, false);
}

function authenticated(req, next, user) {
    // @ts-ignore
    req.user = user;
    
    // @ts-ignore
    req.is_authenticated = true;

    next();
}

function unauthenticated(req, res, next, clear = true) {
    // @ts-ignore
    req.is_authenticated = false;
    
    if (clear) {
        res.clearCookie(config.cookieName);
    }

    next();
}

export function checkAuthenticated(req, res, next) {
    if (req.is_authenticated) {
        next();
    } else {
        res.redirect(config.redirectUnauthenticated);
    }
}

export function checkNotAuthenticated(req, res, next) {
    if (! req.is_authenticated) {
        next();
    } else {
        res.redirect(config.redirectAuthenticated);
    }
}