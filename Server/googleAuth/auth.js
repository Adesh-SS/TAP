const dotenv = require('dotenv').config();
const passport = require('passport')

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = process.env.G_CID;
const GOOGLE_CLIENT_SECRET =   process.env.G_CSEC;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}
));

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})