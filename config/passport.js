const mongoose = require('mongoose')
const User = require('../models/user')
const dotenv = require('dotenv')

// Load config
dotenv.config({ path: './config/config.env'})

const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function(passport) {

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
        
            }
            // Login/Register in a single btn
            try {
                // see if user exists
                let user = await User.findOne({ googleId: profile.id })
                if (user) {
                    done(null, user)
                } else {
                    // create user
                    user = await User.create(newUser)
                    done(null, user)
                }
            } catch (err) {
                console.log(err)
            }
      }));

    passport.serializeUser( function(user, done) {
        done(null, user.id)
    })
    
    passport.deserializeUser( function(id, done) {
        User.findById(id, (err, user) => done(err, user))
    })
}