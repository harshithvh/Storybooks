// "start": "cross-env NODE_ENV=production node app", => in case you want to deploy the app, in package.json under scripts

const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// Load config
dotenv.config({ path: './config/config.env'})

// Passport config
require('./config/passport')(passport) // so that we can use in this file

const app = express()

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Method override
app.use(methodOverride('_method'))

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars helpers
const { stripTags, truncate, editIcon } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs.engine({
    helpers: {
        stripTags,
        truncate,
        editIcon
    },
     defaultLayout: 'main',
     extname: '.hbs' // To change the extension name from .handlebars to .hbs
    })
) 
app.set('view engine', '.hbs')

//Sessions (shd be above passport middleware)
app.use(session({
    secret: 'cat',
    resave: false, // we dont want to save a session if nothing is modified
    saveUninitialized: false, // dont create a session until something is stored
    store: new MongoStore({ mongooseConnection: mongoose.connection}) // to store the session in the db so that there is no need to login again (if the user forgets to logout)
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use((req, res, next) => {
    res.locals.user = req.user || null // this(res.locals.user) is a global variable that is available to all the views(folder), req.user is the user who is currently logged in (if any)
    next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

// Connect to db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
      console.log('Connected to Database')
      app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
      
   })
   .catch((err) => console.log(err))


