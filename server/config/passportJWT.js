const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const prisma = new PrismaClient();

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secretKey'
}, async (jwtPayload, done) => {
    try {
        console.log('JWT Payload:', jwtPayload);

        const user = await prisma.user.findUnique({ where: {id: jwtPayload.id }});
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}))

function authenticateJwt(req, res, next) {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        console.log(err, user)
        if (err) return next(err);
        if (!user) return res.status(401).json({message: 'Unauthorised'});
        req.user = user;
        next();
    })(req, res, next);
}

module.exports = {
    authenticateJwt
};