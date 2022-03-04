# Express Auth DB

## Usage
```js
const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const { setup, authenticate, checkAuthenticated, checkNotAuthenticated } = require('express-auth-db');

// models
const Auth = require('./models/auth');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

setup({
    createAuth: (id, key) => {
        return Auth.create({
            user_id: id,
            key,
        });
    },
    checkAuth: (key) => {
        return Auth.findOne({
            key,
            expires_at: {
                $gt: Date.now()
            }
        });
    },
    getUser: (id) => User.findById(id),
    setCookie: (res, key) => res.cookie('key', key, {
        expires: new Date(Date.now() + 3155695200000) // 100 years
    }),
    randomKey: () => new Promise((resolve, reject) => crypto.randomBytes(64, (e, buf) => {
        if (e) return reject(e);

        resolve(buf.toString('hex));
    })),
    redirectAuthenticated: '/',
    redirectUnauthenticated: '/',
});

app.use(cookieParser());
app.use(authenticate);

app.post('/login', checkNotAuthenticated, async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    if (user && user.checkPassword(req.body.password)) {
        await login(user._id, res);
    } else {
        res.send('error');
    }

    res.send('ok');
});

app.get('/check', checkAuthenticated, (req, res) => {
    res.send(`name: ${req.user.name}`);
});

app.listen(PORT, () => {
    console.log(`Server is running at https://localhost:${PORT}`);
});
```