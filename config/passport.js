const local_startegy = require('passport-local').Strategy;
const User = require('../models/users');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){

    //local strategy
    passport.use(new local_startegy(function(username, password, done){
        //match username
        let query = {username:username};
        User.findOne(query, function(err, user){
            if (err)
            {
                throw err;
            }
            if (!user)
            {
                return done(null, false, {message: 'no user found'});
            }
            //match password
            bcrypt.compare(password, user.password, function(err, isMatch){
                if (err)
                {
                    throw err;
                }
                if (isMatch)
                {
                    return done(null, user);
                }
                else
                {
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        });

    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });

      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}
