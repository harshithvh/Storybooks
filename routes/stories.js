const express = require('express')
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/story')

const router = express.Router()

// Show add page
// @route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add.hbs') // The add.hbs follows the layout of main.hbs only the {{body}} is replaced by the body of add.hbs
})

// Process add page
// @route POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        // if xyz user has logged in then we are grabbing his/her id from the database(req.user.id)
        // and we are connecting it to the story model through the ref property before creating a new story
        req.body.user = req.user.id // we are manually connecting the user id(logged in user) to the story model and the rest is coming from the form(req.body)
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500.hbs')
    }
})

// Show all stories
// @route GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public'}) // we are filtering the stories that are public only
           .populate('user') // we want to display some user's details(from the user model) in the dashboard
           .sort({ createdAt: 'desc' }) // we want to sort the stories in descending order
           .lean() // we want to use the lean() method to pass data to the hbs template
        
        res.render('stories/index.hbs', { // The index.hbs follows the layout of main.hbs only the {{body}} is replaced by the body of index.hbs
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500.hbs')
    }
})

// Show single story
// @route GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
           .populate('user') // we want to display some user's details(from the user model) in the dashboard
           .lean() // we want to use the lean() method to pass data to the hbs template

        if (!story) {
            return res.render('error/404.hbs')
        }

        res.render('stories/show.hbs', { // The show.hbs follows the layout of main.hbs only the {{body}} is replaced by the body of show.hbs
            story
        })
    } catch (err) {
        console.error(err)
        res.render('error/404.hbs')
    }

})

// Show edit page
// @route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {

    try {

        const story = await Story.findById(req.params.id).lean()
    
        if(!story) {
            return res.render('error/404.hbs')
        }
    
        if (story.user != req.user.id) { // if the story is not created by the logged in user 
            return res.redirect('/stories')
        } else {
            res.render('stories/edit.hbs', {
                story
            })
        }

    } catch (err) {
        console.error(err)
        res.render('error/500.hbs')
    }
})

// Show Update page
// @route PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {

    try {

        let story = await Story.findById(req.params.id)
    
        if(!story) {
            return res.render('error/404.hbs')
        }
    
        if (story.user != req.user.id) { // if the story is not created by the logged in user 
            return res.redirect('/stories')
        } else {
            await Story.findByIdAndUpdate(req.params.id, req.body)
            res.redirect('/dashboard')
        }

    } catch (err) {
        console.error(err)
        res.render('error/500.hbs')
    }
})

// Delete story
// @route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.findByIdAndRemove(req.params.id)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500.hbs')
    }
})

// User stories
// @route GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        await Story.find({ user: req.params.userId, status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
            .then(stories => {
                res.render('stories/index.hbs', {
                    stories
                })
            })
    } catch (err) {
        console.error(err)
        res.render('error/500.hbs')
    }
})

module.exports = router