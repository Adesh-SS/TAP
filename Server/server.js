const cookieSession = require('cookie-session');
const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv').config();
const cors = require('cors');

const passportSetup = require('./googleAuth/auth');
const authRoutes = require('./routes/route');

const app = express();

app.use(cookieSession({
    name: 'session',
    keys: ['shit'],
    maxAge: 24*60*60*100
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));

app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});