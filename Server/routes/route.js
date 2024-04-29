const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('http://localhost:5173');
  }
}

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
  passport.authenticate('google', 
  { 
    failureRedirect: 'http://localhost:5173'
  }), (res, req) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET);
    res.json({ token });
  }
);

router.get('/student', ensureAuthenticated, (req, res) => {
  const token = req.headers['authorization'];

  if(!token) {
    res.redirect('http://localhost:5173');
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err) {
      res.redirect('http://localhost:5173');
    } else {
      res.redirect('http://localhost:5173/student');
    }
  })
});

module.exports = router;