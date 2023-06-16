const User = require("../models/database.model");
const passport = require("passport");
const jwt = require("jsonwebtoken")
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'My secret';
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log(jwt_payload.id);
    User.findById(jwt_payload.id)
        .then((user, err) => {
            console.log(user);
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);

                // or you could create a new account
            }
        });
}));
