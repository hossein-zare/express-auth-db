const callbacks = {
    createAuth: null,
    checkAuth: null,
    findUser: null,
    setCookie: null,
    randomKey: null
};

export function setup(opt) {
    Object.assign(callbacks, opt);
}

export async function login(id, res) {
    const key = await callbacks.randomKey();

    await callbacks.createAuth(id, key);

    callbacks.setCookie(res, key);

    return true;
}

export async function authenticate(req, res, next) {
    if (req.cookies.key) {
        const auth = await callbacks.checkAuth(req.cookies.key)

        if (auth) {
            const user = await callbacks.findUser(auth?.user_id);

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
        res.clearCookie('key');
    }

    next();
}

export function checkAuthenticated(req, res, next) {
    if (req.is_authenticated) {
        next();
    } else {
        res.redirect('/');
    }
}

export function checkNotAuthenticated(req, res, next) {
    if (! req.is_authenticated) {
        next();
    } else {
        res.redirect('/');
    }
}