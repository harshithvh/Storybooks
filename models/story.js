const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'] // enum is a set of values that can be used
    },
    // We want to know which user created which story (who did what) but we have two different models(user and story)
    // so we need to create a relationship(connect) between the two models therefore we use a reference(ref), so here we are using ref to connect the user model to the story model
    user: { 
        type: mongoose.Schema.Types.ObjectId, // this is a reference to the user model
        ref: 'User' // this is the name of the model
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Story', storySchema)