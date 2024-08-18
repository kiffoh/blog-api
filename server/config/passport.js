const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function validatePassword(user, password) {
  return await bcrypt.compare(password, user.password);
}

passport.use(new LocalStrategy({
    usernameField: 'email', // If you want to use email instead of username
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
  
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
  
      const isValid = await validatePassword(user, password); // Assuming validatePassword is a custom function
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
  
      return done(null, user);
    } catch (err) {
      return done(err);
    }
}));

module.exports = passport;