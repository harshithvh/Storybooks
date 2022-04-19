module.exports = {
    ensureAuth: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/') // If the user tries to go to dashboard without logging in redirect to login page
    },
    ensureGuest: function(req, res, next) { 
        if (!req.isAuthenticated()) { 
            return next() 
        }
        res.redirect('/dashboard') // If user is already logged in(& forgets to logout) in the next visit instead of redirecting to login page redirect to dashboard
    }
}