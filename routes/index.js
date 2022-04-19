const express = require('express')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/story')

const router = express.Router()

// Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login.hbs', { // The login.hbs here is the one outside the layouts folder
        layout: 'login' // since in the app.js we have mentioned defaultLayout as main therefore it uses the layout of main.hbs but we need 
        // it to use the layout of login.hbs (this is how outer login.hbs is connected to the inner login.hbs)
    })
})

// Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {

    try {
        // we want to limit it to the logged in user(so that the stories of only the logged in user is displayed) through the req.user.id , id coming from the database - users
        // Ex: if xyz user is logged in then only xyz user's stories are displayed in the dashboard
        // check the stories collection in database to see how a user's id(user.id) is connected to a particular story(story.user)
        const stories = await Story.find({ user: req.user.id }).lean() // in order to pass data to the hbs template we use the lean() method
        res.render('dashboard.hbs', { // The dashboard.hbs follows the layout of main.hbs only the {{body}} is replaced by the body of dashboard.hbs
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500.hbs')
    }
})

module.exports = router