const router = require('express').Router();
const passport = require('passport');

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile'],
    accessType: 'offline',
    prompt: 'consent'
  })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173' }),
  function(req, res) {
    res.redirect('http://localhost:5173/student');
  });

module.exports = router;