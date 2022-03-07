# Express Auth DB

## Usage
```js
const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const {
    setup,
    authenticate,
    login,
    logout,
    checkAuthenticated,
    checkNotAuthenticated
} = require('express-auth-db');

// models
const Auth = require('./models/auth');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

setup({
    cookieName: 'key',
    authUserIdField: 'userId',
    createAuth: (userId, key) => Auth.create({ userId, key, })
    checkAuth: (key) => {
        return Auth.findOne({
            key,
            expiresAt: {
                $gt: Date.now()
            }
        }, {
            userId: 1
        });
    },
    deleteAuth: (key) => Auth.deleteOne({ key }),
    getUser: (id) => User.findById(id),
    setCookie: (res, key) => {
        res.cookie('key', key, {
            expires: new Date(Date.now() + 3155695200000) // 100 years
        });
    },
    randomKey: () => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(64, (e, buf) => {
                if (e) return reject(e);

                resolve(buf.toString('hex'));
            }
        }));
    },
    redirectAuthenticated: '/profile',
    redirectUnauthenticated: '/login',
});

app.use(cookieParser());
app.use(authenticate);

app.post('/login', checkNotAuthenticated, async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    if (user && user.checkPassword(req.body.password)) {
        await login(user._id, res);

        res.send('ok');
    } else {
        res.send('error');
    }
});

app.post('/logout', checkAuthenticated, (req, res) => {
    await logout(req, res);

    res.redirect('/');
});

app.get('/check', (req, res) => {
    if (req.isAuthenticated) {
        res.send(':)');
    } else {
        res.send(':(');
    }
});

app.get('/profile', checkAuthenticated, (req, res) => {
    res.send(`name: ${req.user.name}`);
});

app.listen(PORT, () => {
    console.log(`Server is running at https://localhost:${PORT}`);
});
```

## User in views
+ view.pug
    
    ```pug
    if isAuthenticated
        #{user.name}
    else
        p Please log in...
    ```