const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

const passportSetup = require('./googleAuth/auth');
const authRoutes = require('./routes/route');

const app = express();

app.use(session({
    secret: 'dickhead',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Note: secure should be set to true if your application is running over HTTPS
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