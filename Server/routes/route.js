const router = require('express').Router();
const passport = require('passport');

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:5173');
})

router.get('/google', passport.authenticate('google', {scope: ['profile']}));

router.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect: "http://localhost:5173/student",
        failureRedirect: "http://localhost:5173"
    })
);

module.exports = router;