const config = {
    cookieName: 'key',
    authUserIdField: 'userId',
    createAuth: null,
    checkAuth: null,
    deleteAuth: null,
    getUser: null,
    setCookie: null,
    randomKey: null,
    redirectAuthenticated: '/',
    redirectUnauthenticated: '/',
};

function setup(opt) {
    Object.assign(config, opt);
}

async function login(id, res) {
    const key = await config.randomKey();

    await config.createAuth(id, key);

    config.setCookie(res, key);

    return true;
}

async function logout(req, res) {
    if (req.cookies?.[config.cookieName]) {
        await config.deleteAuth(req.cookies[config.cookieName]);

        res.clearCookie(config.cookieName);

        return true;
    }

    return false;
}

async function authenticate(req, res, next) {
    if (req.cookies?.[config.cookieName]) {
        const auth = await config.checkAuth(req.cookies[config.cookieName])

        if (auth) {
            const user = await config.getUser(auth?.[config.authUserIdField]);

            if (user) {
                return authenticated(req, res, next, user);
            }
        }

        return unauthenticated(req, res, next);
    }
    
    return unauthenticated(req, res, next, false);
}

function authenticated(req, res, next, user) {
    req.user = user;
    res.locals.user = user;
    
    req.isAuthenticated = true;
    res.locals.isAuthenticated = true;

    next();
}

function unauthenticated(req, res, next, clear = true) {
    req.isAuthenticated = false;
    res.locals.isAuthenticated = false;
    
    if (clear) {
        res.clearCookie(config.cookieName);
    }

    next();
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated) {
        next();
    } else {
        res.redirect(config.redirectUnauthenticated);
    }
}

function checkNotAuthenticated(req, res, next) {
    if (! req.isAuthenticated) {
        next();
    } else {
        res.redirect(config.redirectAuthenticated);
    }
}

module.exports = {
    setup,
    login,
    logout,
    authenticate,
    checkAuthenticated,
    checkNotAuthenticated
};