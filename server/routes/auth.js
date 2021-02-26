/**
 * Auth api
 */
const router = require('express').Router();
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/users');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

/**
 *  fetch signed-in user route
 */
router.get("/user", async (req, res) => {
  res.send(req.session.user)
})

/**
 *  google login route
 */
router.post('/google', async function(req, res) {
  const { token }  = req.body

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const { name, sub } = ticket.getPayload();

  User.findOrCreate({googleId: sub, name: name}, function (err, user) {
    req.session.user = user;

    if(err) {
      console.log(err);
      res.send(500)
    } else {
      res.send(user)
    }
  });
});

/**
 *  logout route
 */
router.delete("/logout", async (req, res) => {
  await req.session.destroy()
  res.send(200)
})


module.exports = router;
